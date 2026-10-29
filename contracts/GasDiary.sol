// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title GasDiary
 * @notice Stores personal transaction expense categories and notes on BOT Chain.
 * @dev Users can label and annotate their historical transactions on-chain.
 */
contract GasDiary {
    struct TagRecord {
        bytes32 txHash;
        string category;
        string note;
        uint256 updatedAt;
        bool exists;
    }

    // user => txHash => TagRecord
    mapping(address => mapping(bytes32 => TagRecord)) private _userTags;

    // user => list of tagged tx hashes for easy querying
    mapping(address => bytes32[]) private _userTaggedHashes;

    // user => txHash => index in _userTaggedHashes + 1 (0 means not in array)
    mapping(address => mapping(bytes32 => uint256)) private _hashIndex;

    event TransactionTagged(
        address indexed user,
        bytes32 indexed txHash,
        string category,
        string note,
        uint256 timestamp
    );

    event TagRemoved(
        address indexed user,
        bytes32 indexed txHash,
        uint256 timestamp
    );

    /**
     * @notice Tag a single transaction with an expense category and optional note.
     * @param txHash The transaction hash to categorize.
     * @param category Expense category (e.g. "DeFi Swap", "NFT Mint", "Transfer").
     * @param note Optional user memo or note.
     */
    function tagTransaction(
        bytes32 txHash,
        string calldata category,
        string calldata note
    ) external {
        require(txHash != bytes32(0), "Invalid txHash");
        require(bytes(category).length > 0, "Category cannot be empty");

        _setTag(msg.sender, txHash, category, note);
    }

    /**
     * @notice Batch tag multiple transactions in a single on-chain transaction.
     * @param txHashes Array of transaction hashes.
     * @param categories Array of categories.
     * @param notes Array of notes.
     */
    function batchTagTransactions(
        bytes32[] calldata txHashes,
        string[] calldata categories,
        string[] calldata notes
    ) external {
        uint256 len = txHashes.length;
        require(len > 0, "Empty batch");
        require(categories.length == len && notes.length == len, "Array length mismatch");

        for (uint256 i = 0; i < len; i++) {
            require(txHashes[i] != bytes32(0), "Invalid txHash");
            require(bytes(categories[i]).length > 0, "Category cannot be empty");
            _setTag(msg.sender, txHashes[i], categories[i], notes[i]);
        }
    }

    /**
     * @notice Remove a tag from a transaction.
     * @param txHash The transaction hash to untag.
     */
    function removeTag(bytes32 txHash) external {
        require(_userTags[msg.sender][txHash].exists, "Tag does not exist");

        delete _userTags[msg.sender][txHash];

        // Remove from list
        uint256 idxPlusOne = _hashIndex[msg.sender][txHash];
        if (idxPlusOne > 0) {
            uint256 index = idxPlusOne - 1;
            uint256 lastIndex = _userTaggedHashes[msg.sender].length - 1;

            if (index != lastIndex) {
                bytes32 lastHash = _userTaggedHashes[msg.sender][lastIndex];
                _userTaggedHashes[msg.sender][index] = lastHash;
                _hashIndex[msg.sender][lastHash] = index + 1;
            }

            _userTaggedHashes[msg.sender].pop();
            delete _hashIndex[msg.sender][txHash];
        }

        emit TagRemoved(msg.sender, txHash, block.timestamp);
    }

    /**
     * @notice Get a specific tag record for a user.
     */
    function getUserTag(address user, bytes32 txHash)
        external
        view
        returns (
            string memory category,
            string memory note,
            uint256 updatedAt,
            bool exists
        )
    {
        TagRecord memory record = _userTags[user][txHash];
        return (record.category, record.note, record.updatedAt, record.exists);
    }

    /**
     * @notice Get all transaction hashes tagged by a user.
     */
    function getUserTaggedHashes(address user) external view returns (bytes32[] memory) {
        return _userTaggedHashes[user];
    }

    /**
     * @notice Query multiple tag records at once.
     */
    function getUserTagsBatch(address user, bytes32[] calldata txHashes)
        external
        view
        returns (TagRecord[] memory)
    {
        uint256 len = txHashes.length;
        TagRecord[] memory results = new TagRecord[](len);

        for (uint256 i = 0; i < len; i++) {
            results[i] = _userTags[user][txHashes[i]];
        }

        return results;
    }

    /**
     * @notice Total number of transactions tagged by a user.
     */
    function getUserTagCount(address user) external view returns (uint256) {
        return _userTaggedHashes[user].length;
    }

    // Internal helper
    function _setTag(
        address user,
        bytes32 txHash,
        string calldata category,
        string calldata note
    ) internal {
        if (!_userTags[user][txHash].exists) {
            _userTaggedHashes[user].push(txHash);
            _hashIndex[user][txHash] = _userTaggedHashes[user].length;
        }

        _userTags[user][txHash] = TagRecord({
            txHash: txHash,
            category: category,
            note: note,
            updatedAt: block.timestamp,
            exists: true
        });

        emit TransactionTagged(user, txHash, category, note, block.timestamp);
    }
}
