/**
 * ZipList 核心逻辑实现
 * 实现Redis ZipList的创建、操作和算法
 */

import {
  ZipListState,
  ZipListHeader,
  ZipListEntry,
  MemoryByte,
  EntryEncoding,
  ENCODING_BYTES,
  OperationParams,
  OperationResult,
  EncodingDecision,
  CascadeUpdateInfo,
} from '@/types/ziplist';

// ZipList常量
export const ZIPLIST_HEADER_SIZE = 12;  // 4 + 4 + 4字节
export const ZIPLIST_END_SIZE = 1;       // 0xFF
export const PREVLEN_THRESHOLD = 254;    // prevlen字段的阈值

/**
 * 创建空的ZipList
 */
export function createEmptyZipList(): ZipListState {
  const header: ZipListHeader = {
    zlbytes: ZIPLIST_HEADER_SIZE + ZIPLIST_END_SIZE,
    zltail: ZIPLIST_HEADER_SIZE,
    zllen: 0,
  };

  const memoryBlocks = createMemoryBlocks(header, [], 0xFF);

  return {
    header,
    entries: [],
    end: 0xFF,
    memoryBlocks,
    totalBytes: ZIPLIST_HEADER_SIZE + ZIPLIST_END_SIZE,
    createdAt: Date.now(),
  };
}

/**
 * 创建带初始数据的ZipList
 */
export function createZipList(initialValues: (string | number)[]): ZipListState {
  let state = createEmptyZipList();
  
  for (const value of initialValues) {
    const result = insertEntry(state, state.entries.length, value);
    if (result.success) {
      state = result.newState;
    }
  }
  
  return state;
}

/**
 * 选择最优编码类型
 */
export function selectEncoding(value: string | number, forceEncoding?: EntryEncoding): EncodingDecision {
  const testedEncodings: EncodingDecision['testedEncodings'] = [];
  
  // 检测值类型
  const inputType = typeof value === 'number' ? 'number' : 'string';
  
  if (forceEncoding) {
    // 强制使用指定编码
    const bytesNeeded = calculateEncodingSize(value, forceEncoding);
    return {
      input: value,
      inputType,
      testedEncodings: [{
        encoding: forceEncoding,
        isValid: true,
        reason: '强制指定的编码类型',
        bytesNeeded,
      }],
      selectedEncoding: forceEncoding,
      encodingByte: ENCODING_BYTES[forceEncoding],
      totalBytes: bytesNeeded,
    };
  }
  
  // 尝试整数编码
  if (typeof value === 'number' && Number.isInteger(value)) {
    // INT8: -128 ~ 127
    if (value >= -128 && value <= 127) {
      testedEncodings.push({
        encoding: EntryEncoding.INT8,
        isValid: true,
        reason: '小整数，使用INT8编码',
        bytesNeeded: 1 + 1, // encoding + content
      });
      
      return {
        input: value,
        inputType,
        testedEncodings,
        selectedEncoding: EntryEncoding.INT8,
        encodingByte: ENCODING_BYTES[EntryEncoding.INT8],
        totalBytes: 2,
      };
    }
    
    testedEncodings.push({
      encoding: EntryEncoding.INT8,
      isValid: false,
      reason: `值${value}超出INT8范围(-128~127)`,
      bytesNeeded: 0,
    });
    
    // INT16: -32768 ~ 32767
    if (value >= -32768 && value <= 32767) {
      testedEncodings.push({
        encoding: EntryEncoding.INT16,
        isValid: true,
        reason: '中等整数，使用INT16编码',
        bytesNeeded: 1 + 2,
      });
      
      return {
        input: value,
        inputType,
        testedEncodings,
        selectedEncoding: EntryEncoding.INT16,
        encodingByte: ENCODING_BYTES[EntryEncoding.INT16],
        totalBytes: 3,
      };
    }
    
    testedEncodings.push({
      encoding: EntryEncoding.INT16,
      isValid: false,
      reason: `值${value}超出INT16范围(-32768~32767)`,
      bytesNeeded: 0,
    });
    
    // INT24: -8388608 ~ 8388607
    if (value >= -8388608 && value <= 8388607) {
      testedEncodings.push({
        encoding: EntryEncoding.INT24,
        isValid: true,
        reason: '较大整数，使用INT24编码',
        bytesNeeded: 1 + 3,
      });
      
      return {
        input: value,
        inputType,
        testedEncodings,
        selectedEncoding: EntryEncoding.INT24,
        encodingByte: ENCODING_BYTES[EntryEncoding.INT24],
        totalBytes: 4,
      };
    }
    
    // INT32: -2147483648 ~ 2147483647
    if (value >= -2147483648 && value <= 2147483647) {
      testedEncodings.push({
        encoding: EntryEncoding.INT32,
        isValid: true,
        reason: '大整数，使用INT32编码',
        bytesNeeded: 1 + 4,
      });
      
      return {
        input: value,
        inputType,
        testedEncodings,
        selectedEncoding: EntryEncoding.INT32,
        encodingByte: ENCODING_BYTES[EntryEncoding.INT32],
        totalBytes: 5,
      };
    }
    
    // INT64
    testedEncodings.push({
      encoding: EntryEncoding.INT64,
      isValid: true,
      reason: '超大整数，使用INT64编码',
      bytesNeeded: 1 + 8,
    });
    
    return {
      input: value,
      inputType,
      testedEncodings,
      selectedEncoding: EntryEncoding.INT64,
      encodingByte: ENCODING_BYTES[EntryEncoding.INT64],
      totalBytes: 9,
    };
  }
  
  // 字符串编码
  const strValue = String(value);
  const strLength = new TextEncoder().encode(strValue).length;
  
  // STR_6BIT: 最大63字节
  if (strLength <= 63) {
    testedEncodings.push({
      encoding: EntryEncoding.STR_6BIT,
      isValid: true,
      reason: '短字符串，长度用6bit表示',
      bytesNeeded: 1 + strLength,
    });
    
    return {
      input: value,
      inputType,
      testedEncodings,
      selectedEncoding: EntryEncoding.STR_6BIT,
      encodingByte: ENCODING_BYTES[EntryEncoding.STR_6BIT] | strLength,
      totalBytes: 1 + strLength,
    };
  }
  
  testedEncodings.push({
    encoding: EntryEncoding.STR_6BIT,
    isValid: false,
    reason: `字符串长度${strLength}超出6bit表示范围(0~63)`,
    bytesNeeded: 0,
  });
  
  // STR_14BIT: 最大16383字节
  if (strLength <= 16383) {
    testedEncodings.push({
      encoding: EntryEncoding.STR_14BIT,
      isValid: true,
      reason: '中等字符串，长度用14bit表示',
      bytesNeeded: 2 + strLength,
    });
    
    return {
      input: value,
      inputType,
      testedEncodings,
      selectedEncoding: EntryEncoding.STR_14BIT,
      encodingByte: ENCODING_BYTES[EntryEncoding.STR_14BIT],
      totalBytes: 2 + strLength,
    };
  }
  
  // STR_32BIT
  testedEncodings.push({
    encoding: EntryEncoding.STR_32BIT,
    isValid: true,
    reason: '长字符串，长度用32bit表示',
    bytesNeeded: 5 + strLength,
  });
  
  return {
    input: value,
    inputType,
    testedEncodings,
    selectedEncoding: EntryEncoding.STR_32BIT,
    encodingByte: ENCODING_BYTES[EntryEncoding.STR_32BIT],
    totalBytes: 5 + strLength,
  };
}

/**
 * 计算编码所需的字节数
 */
function calculateEncodingSize(value: string | number, encoding: EntryEncoding): number {
  const contentSize = getContentSize(value, encoding);
  const encodingSize = getEncodingFieldSize(encoding);
  return encodingSize + contentSize;
}

/**
 * 获取编码字段的大小
 */
function getEncodingFieldSize(encoding: EntryEncoding): number {
  switch (encoding) {
    case EntryEncoding.STR_6BIT:
      return 1;
    case EntryEncoding.STR_14BIT:
      return 2;
    case EntryEncoding.STR_32BIT:
      return 5;
    default: // 整数编码
      return 1;
  }
}

/**
 * 获取内容部分的大小
 */
function getContentSize(value: string | number, encoding: EntryEncoding): number {
  switch (encoding) {
    case EntryEncoding.INT8:
      return 1;
    case EntryEncoding.INT16:
      return 2;
    case EntryEncoding.INT24:
      return 3;
    case EntryEncoding.INT32:
      return 4;
    case EntryEncoding.INT64:
      return 8;
    case EntryEncoding.STR_6BIT:
    case EntryEncoding.STR_14BIT:
    case EntryEncoding.STR_32BIT:
      return new TextEncoder().encode(String(value)).length;
  }
}

/**
 * 计算prevlen字段的大小
 */
function calculatePrevlenSize(prevEntrySize: number): number {
  return prevEntrySize < PREVLEN_THRESHOLD ? 1 : 5;
}

/**
 * 插入节点
 */
export function insertEntry(
  state: ZipListState,
  position: number,
  value: string | number,
  params?: OperationParams
): OperationResult {
  // 验证位置
  if (position < 0 || position > state.entries.length) {
    return {
      success: false,
      newState: state,
      message: `无效的插入位置: ${position}`,
      affectedEntries: [],
    };
  }
  
  // 选择编码
  const encodingDecision = selectEncoding(value, params?.forceEncoding);
  
  // 计算前一个节点的大小
  const prevEntrySize = position === 0 ? 0 : state.entries[position - 1].totalSize;
  const prevlenSize = calculatePrevlenSize(prevEntrySize);
  
  // 创建新节点
  const contentSize = getContentSize(value, encodingDecision.selectedEncoding);
  const encodingSize = getEncodingFieldSize(encodingDecision.selectedEncoding);
  const totalSize = prevlenSize + encodingSize + contentSize;
  
  const newEntry: ZipListEntry = {
    index: position,
    prevlen: prevEntrySize,
    prevlenSize,
    encoding: encodingDecision.selectedEncoding,
    encodingByte: encodingDecision.encodingByte,
    content: value,
    contentSize,
    totalSize,
    offset: position === 0 ? ZIPLIST_HEADER_SIZE : state.entries[position - 1].offset + state.entries[position - 1].totalSize,
    isNew: true,
  };
  
  // 创建新的entries数组
  const newEntries = [...state.entries];
  newEntries.splice(position, 0, newEntry);
  
  // 检查连锁更新
  const cascadeInfo = checkCascadeUpdate(newEntries, position);
  
  // 应用连锁更新
  if (cascadeInfo.updateCount > 0) {
    applyCascadeUpdate(newEntries, cascadeInfo);
  }
  
  // 重新计算所有偏移量和索引
  recalculateOffsets(newEntries);
  
  // 更新header
  const newTotalBytes = ZIPLIST_HEADER_SIZE + 
    newEntries.reduce((sum, e) => sum + e.totalSize, 0) + 
    ZIPLIST_END_SIZE;
  
  const newHeader: ZipListHeader = {
    zlbytes: newTotalBytes,
    zltail: newEntries.length > 0 ? newEntries[newEntries.length - 1].offset : ZIPLIST_HEADER_SIZE,
    zllen: newEntries.length,
  };
  
  // 创建新的内存块
  const memoryBlocks = createMemoryBlocks(newHeader, newEntries, state.end);
  
  const newState: ZipListState = {
    header: newHeader,
    entries: newEntries,
    end: state.end,
    memoryBlocks,
    totalBytes: newTotalBytes,
    createdAt: state.createdAt,
  };
  
  return {
    success: true,
    newState,
    message: `成功在位置${position}插入节点`,
    affectedEntries: [position, ...cascadeInfo.affectedEntries],
    cascadeUpdateCount: cascadeInfo.updateCount,
    bytesAdded: totalSize + cascadeInfo.totalBytesAdded,
  };
}

/**
 * 检查是否需要连锁更新
 */
function checkCascadeUpdate(entries: ZipListEntry[], startPosition: number): CascadeUpdateInfo {
  const affectedEntries: number[] = [];
  const updateChain: CascadeUpdateInfo['updateChain'] = [];
  let totalBytesAdded = 0;
  
  // 从插入位置的下一个节点开始检查
  for (let i = startPosition + 1; i < entries.length; i++) {
    const currentEntry = entries[i];
    const prevEntry = entries[i - 1];
    const newPrevlenSize = calculatePrevlenSize(prevEntry.totalSize);
    
    // 如果prevlen大小需要变化
    if (newPrevlenSize !== currentEntry.prevlenSize) {
      const oldTotalSize = currentEntry.totalSize;
      const newTotalSize = oldTotalSize - currentEntry.prevlenSize + newPrevlenSize;
      
      updateChain.push({
        entryIndex: i,
        oldPrevlenSize: currentEntry.prevlenSize,
        newPrevlenSize,
        oldTotalSize,
        newTotalSize,
      });
      
      affectedEntries.push(i);
      totalBytesAdded += newPrevlenSize - currentEntry.prevlenSize;
      
      // 更新entry以便下一次检查
      entries[i] = {
        ...currentEntry,
        prevlenSize: newPrevlenSize,
        totalSize: newTotalSize,
      };
    } else {
      // 如果不需要更新，连锁终止
      break;
    }
  }
  
  return {
    triggerEntry: startPosition,
    affectedEntries,
    updateChain,
    totalBytesAdded,
    updateCount: updateChain.length,
  };
}

/**
 * 应用连锁更新
 */
function applyCascadeUpdate(entries: ZipListEntry[], cascadeInfo: CascadeUpdateInfo): void {
  for (const update of cascadeInfo.updateChain) {
    const entry = entries[update.entryIndex];
    const prevEntry = entries[update.entryIndex - 1];
    
    entries[update.entryIndex] = {
      ...entry,
      prevlen: prevEntry.totalSize,
      prevlenSize: update.newPrevlenSize,
      totalSize: update.newTotalSize,
      isUpdating: true,
    };
  }
}

/**
 * 重新计算所有节点的偏移量和索引
 */
function recalculateOffsets(entries: ZipListEntry[]): void {
  let currentOffset = ZIPLIST_HEADER_SIZE;
  
  for (let i = 0; i < entries.length; i++) {
    entries[i].index = i;
    entries[i].offset = currentOffset;
    currentOffset += entries[i].totalSize;
  }
}

/**
 * 删除节点
 */
export function deleteEntry(state: ZipListState, position: number): OperationResult {
  if (position < 0 || position >= state.entries.length) {
    return {
      success: false,
      newState: state,
      message: `无效的删除位置: ${position}`,
      affectedEntries: [],
    };
  }
  
  const deletedEntry = state.entries[position];
  const bytesRemoved = deletedEntry.totalSize;
  
  // 创建新的entries数组
  const newEntries = state.entries.filter((_, i) => i !== position);
  
  // 更新后续节点的prevlen
  if (position < newEntries.length) {
    const prevEntrySize = position === 0 ? 0 : newEntries[position - 1].totalSize;
    const newPrevlenSize = calculatePrevlenSize(prevEntrySize);
    
    newEntries[position] = {
      ...newEntries[position],
      prevlen: prevEntrySize,
      prevlenSize: newPrevlenSize,
      totalSize: newEntries[position].totalSize - newEntries[position].prevlenSize + newPrevlenSize,
    };
  }
  
  // 重新计算偏移量
  recalculateOffsets(newEntries);
  
  // 更新header
  const newTotalBytes = ZIPLIST_HEADER_SIZE + 
    newEntries.reduce((sum, e) => sum + e.totalSize, 0) + 
    ZIPLIST_END_SIZE;
  
  const newHeader: ZipListHeader = {
    zlbytes: newTotalBytes,
    zltail: newEntries.length > 0 ? newEntries[newEntries.length - 1].offset : ZIPLIST_HEADER_SIZE,
    zllen: newEntries.length,
  };
  
  const memoryBlocks = createMemoryBlocks(newHeader, newEntries, state.end);
  
  const newState: ZipListState = {
    header: newHeader,
    entries: newEntries,
    end: state.end,
    memoryBlocks,
    totalBytes: newTotalBytes,
    createdAt: state.createdAt,
  };
  
  return {
    success: true,
    newState,
    message: `成功删除位置${position}的节点`,
    affectedEntries: position < newEntries.length ? [position] : [],
    bytesRemoved,
  };
}

/**
 * 创建内存块表示
 */
function createMemoryBlocks(
  header: ZipListHeader,
  entries: ZipListEntry[],
  end: number
): MemoryByte[] {
  const blocks: MemoryByte[] = [];
  let byteIndex = 0;
  
  // Header: zlbytes (4 bytes)
  const zlbytesBytes = numberToBytes(header.zlbytes, 4);
  for (let i = 0; i < 4; i++) {
    blocks.push(createMemoryByte(byteIndex++, zlbytesBytes[i], 'header', undefined, 'zlbytes'));
  }
  
  // Header: zltail (4 bytes)
  const zltailBytes = numberToBytes(header.zltail, 4);
  for (let i = 0; i < 4; i++) {
    blocks.push(createMemoryByte(byteIndex++, zltailBytes[i], 'header', undefined, 'zltail'));
  }
  
  // Header: zllen (4 bytes)
  const zllenBytes = numberToBytes(header.zllen, 4);
  for (let i = 0; i < 4; i++) {
    blocks.push(createMemoryByte(byteIndex++, zllenBytes[i], 'header', undefined, 'zllen'));
  }
  
  // Entries
  for (const entry of entries) {
    // prevlen
    const prevlenBytes = encodePrevlen(entry.prevlen, entry.prevlenSize);
    for (let i = 0; i < prevlenBytes.length; i++) {
      blocks.push(createMemoryByte(byteIndex++, prevlenBytes[i], 'entry', entry.index, 'prevlen'));
    }
    
    // encoding
    const encodingBytes = encodeEncodingField(entry.encoding, entry.contentSize);
    for (let i = 0; i < encodingBytes.length; i++) {
      blocks.push(createMemoryByte(byteIndex++, encodingBytes[i], 'entry', entry.index, 'encoding'));
    }
    
    // content
    const contentBytes = encodeContent(entry.content, entry.encoding);
    for (let i = 0; i < contentBytes.length; i++) {
      blocks.push(createMemoryByte(byteIndex++, contentBytes[i], 'entry', entry.index, 'content'));
    }
  }
  
  // End marker
  blocks.push(createMemoryByte(byteIndex++, end, 'end', undefined, undefined));
  
  return blocks;
}

/**
 * 创建单个内存字节
 */
function createMemoryByte(
  byteIndex: number,
  value: number,
  belongsTo: MemoryByte['belongsTo'],
  entryIndex?: number,
  fieldType?: MemoryByte['fieldType']
): MemoryByte {
  return {
    byteIndex,
    value,
    hexValue: '0x' + value.toString(16).toUpperCase().padStart(2, '0'),
    binaryValue: value.toString(2).padStart(8, '0'),
    belongsTo,
    entryIndex,
    fieldType,
  };
}

/**
 * 将数字转换为字节数组 (小端序)
 */
function numberToBytes(num: number, byteCount: number): number[] {
  const bytes: number[] = [];
  for (let i = 0; i < byteCount; i++) {
    bytes.push((num >> (i * 8)) & 0xFF);
  }
  return bytes;
}

/**
 * 编码prevlen字段
 */
function encodePrevlen(prevlen: number, prevlenSize: number): number[] {
  if (prevlenSize === 1) {
    return [prevlen];
  } else {
    return [0xFE, ...numberToBytes(prevlen, 4)];
  }
}

/**
 * 编码encoding字段
 */
function encodeEncodingField(encoding: EntryEncoding, contentSize: number): number[] {
  switch (encoding) {
    case EntryEncoding.STR_6BIT:
      return [contentSize & 0x3F]; // 00xxxxxx
    case EntryEncoding.STR_14BIT:
      return [
        0x40 | ((contentSize >> 8) & 0x3F), // 01xxxxxx
        contentSize & 0xFF
      ];
    case EntryEncoding.STR_32BIT:
      return [0x80, ...numberToBytes(contentSize, 4)]; // 10xxxxxx
    default: // 整数编码
      return [ENCODING_BYTES[encoding]];
  }
}

/**
 * 编码content内容
 */
function encodeContent(content: string | number, encoding: EntryEncoding): number[] {
  if (typeof content === 'number') {
    // 整数编码
    const size = getContentSize(content, encoding);
    return numberToBytes(content, size);
  } else {
    // 字符串编码
    const bytes = new TextEncoder().encode(content);
    return Array.from(bytes);
  }
}
