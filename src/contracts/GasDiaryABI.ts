export const GasDiaryABI = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'user', type: 'address' },
      { indexed: true, internalType: 'bytes32', name: 'txHash', type: 'bytes32' },
      { indexed: false, internalType: 'string', name: 'category', type: 'string' },
      { indexed: false, internalType: 'string', name: 'note', type: 'string' },
      { indexed: false, internalType: 'uint256', name: 'timestamp', type: 'uint256' },
    ],
    name: 'TransactionTagged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'user', type: 'address' },
      { indexed: true, internalType: 'bytes32', name: 'txHash', type: 'bytes32' },
      { indexed: false, internalType: 'uint256', name: 'timestamp', type: 'uint256' },
    ],
    name: 'TagRemoved',
    type: 'event',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'txHash', type: 'bytes32' },
      { internalType: 'string', name: 'category', type: 'string' },
      { internalType: 'string', name: 'note', type: 'string' },
    ],
    name: 'tagTransaction',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32[]', name: 'txHashes', type: 'bytes32[]' },
      { internalType: 'string[]', name: 'categories', type: 'string[]' },
      { internalType: 'string[]', name: 'notes', type: 'string[]' },
    ],
    name: 'batchTagTransactions',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: 'txHash', type: 'bytes32' }],
    name: 'removeTag',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'user', type: 'address' },
      { internalType: 'bytes32', name: 'txHash', type: 'bytes32' },
    ],
    name: 'getUserTag',
    outputs: [
      { internalType: 'string', name: 'category', type: 'string' },
      { internalType: 'string', name: 'note', type: 'string' },
      { internalType: 'uint256', name: 'updatedAt', type: 'uint256' },
      { internalType: 'bool', name: 'exists', type: 'bool' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
    name: 'getUserTaggedHashes',
    outputs: [{ internalType: 'bytes32[]', name: 'hashes', type: 'bytes32[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'user', type: 'address' },
      { internalType: 'bytes32[]', name: 'txHashes', type: 'bytes32[]' },
    ],
    name: 'getUserTagsBatch',
    outputs: [
      {
        components: [
          { internalType: 'bytes32', name: 'txHash', type: 'bytes32' },
          { internalType: 'string', name: 'category', type: 'string' },
          { internalType: 'string', name: 'note', type: 'string' },
          { internalType: 'uint256', name: 'updatedAt', type: 'uint256' },
          { internalType: 'bool', name: 'exists', type: 'bool' },
        ],
        internalType: 'struct GasDiary.TagRecord[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
    name: 'getUserTagCount',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;
