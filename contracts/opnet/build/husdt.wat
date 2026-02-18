(module
 (type $0 (func (param i32) (result i32)))
 (type $1 (func (param i32 i32)))
 (type $2 (func (param i32 i32) (result i32)))
 (type $3 (func (param i32 i32 i32)))
 (type $4 (func (param i32 i32 i32) (result i32)))
 (type $5 (func))
 (type $6 (func (param i32)))
 (type $7 (func (param i32 i32 i32 i32)))
 (type $8 (func (param i32 i64)))
 (type $9 (func (param i32 i32 i32 i32) (result i32)))
 (type $10 (func (param i32) (result i64)))
 (type $11 (func (param i32 i32 i32 i32 i32) (result i32)))
 (type $12 (func (result i32)))
 (type $13 (func (param i32 i64) (result i32)))
 (type $14 (func (param i32 i32 i32 i32 i32)))
 (type $15 (func (param i32 i64 i32)))
 (type $16 (func (param i32 i64 i64) (result i32)))
 (type $17 (func (param i32 i32) (result i64)))
 (type $18 (func (param i32 i32 i32 i32 i64 i32)))
 (type $19 (func (param i64 i32) (result i32)))
 (type $20 (func (param i32 i64 i32 i32)))
 (type $21 (func (param i32 i64 i64 i64 i64) (result i32)))
 (type $22 (func (param i32 i32 i64)))
 (type $23 (func (param i64 i64) (result i64)))
 (type $24 (func (param i64 i64 i64 i64 i64 i64 i64 i64) (result i32)))
 (type $25 (func (param i64) (result i64)))
 (type $26 (func (param i32 i32 i64) (result i32)))
 (type $27 (func (param i32 i32 i32) (result i64)))
 (type $28 (func (param i32 i32 i32 i32 i32 i64) (result i32)))
 (type $29 (func (param i32 i32 i64 i64) (result i32)))
 (type $30 (func (param i32 i32 i64 i32)))
 (type $31 (func (param i32 i32 i32 i32 i32 i64 i32)))
 (type $32 (func (param i32 i32 i32 i32 i32 i32) (result i32)))
 (import "env" "exit" (func $~lib/@btc-vision/btc-runtime/runtime/env/global/env_exit (param i32 i32 i32)))
 (import "env" "environment" (func $~lib/@btc-vision/btc-runtime/runtime/env/global/getEnvironmentVariables (param i32 i32 i32)))
 (import "env" "calldata" (func $~lib/@btc-vision/btc-runtime/runtime/env/global/getCalldata (param i32 i32 i32)))
 (import "env" "sha256" (func $~lib/@btc-vision/btc-runtime/runtime/env/global/_sha256 (param i32 i32 i32)))
 (import "env" "load" (func $~lib/@btc-vision/btc-runtime/runtime/env/global/loadPointer (param i32 i32)))
 (import "env" "store" (func $~lib/@btc-vision/btc-runtime/runtime/env/global/storePointer (param i32 i32)))
 (import "env" "emit" (func $~lib/@btc-vision/btc-runtime/runtime/env/global/emit (param i32 i32)))
 (import "env" "accountType" (func $~lib/@btc-vision/btc-runtime/runtime/env/global/getAccountType (param i32) (result i32)))
 (import "env" "call" (func $~lib/@btc-vision/btc-runtime/runtime/env/global/callContract (param i32 i32 i32 i32) (result i32)))
 (import "env" "callResult" (func $~lib/@btc-vision/btc-runtime/runtime/env/global/getCallResult (param i32 i32 i32)))
 (import "env" "verifySignature" (func $~lib/@btc-vision/btc-runtime/runtime/env/global/verifySignature (param i32 i32 i32) (result i32)))
 (import "env" "loadMLDSA" (func $~lib/@btc-vision/btc-runtime/runtime/env/global/loadMLDSA (param i32 i32)))
 (global $~lib/shared/runtime/Runtime.Stub i32 (i32.const 0))
 (global $~lib/shared/runtime/Runtime.Minimal i32 (i32.const 1))
 (global $~lib/shared/runtime/Runtime.Incremental i32 (i32.const 2))
 (global $~lib/native/ASC_SHRINK_LEVEL i32 (i32.const 0))
 (global $~lib/rt/stub/startOffset (mut i32) (i32.const 0))
 (global $~lib/rt/stub/offset (mut i32) (i32.const 0))
 (global $~lib/@btc-vision/as-bignum/assembly/integer/u128/u128._ZERO (mut i32) (i32.const 0))
 (global $~lib/@btc-vision/as-bignum/assembly/integer/u128/u128._ONE (mut i32) (i32.const 0))
 (global $~lib/@btc-vision/as-bignum/assembly/integer/u128/u128._MAX (mut i32) (i32.const 0))
 (global $~lib/@btc-vision/btc-runtime/runtime/utils/hex/hexLookupTable i32 (i32.const 2128))
 (global $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/ADDRESS_BYTE_LENGTH i32 (i32.const 32))
 (global $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/EXTENDED_ADDRESS_BYTE_LENGTH i32 (i32.const 64))
 (global $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/SCHNORR_SIGNATURE_BYTE_LENGTH i32 (i32.const 64))
 (global $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/SELECTOR_BYTE_LENGTH i32 (i32.const 4))
 (global $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/U256_BYTE_LENGTH i32 (i32.const 32))
 (global $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/U128_BYTE_LENGTH i32 (i32.const 16))
 (global $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/U64_BYTE_LENGTH i32 (i32.const 8))
 (global $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/U32_BYTE_LENGTH i32 (i32.const 4))
 (global $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/U16_BYTE_LENGTH i32 (i32.const 2))
 (global $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/U8_BYTE_LENGTH i32 (i32.const 1))
 (global $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/I128_BYTE_LENGTH i32 (i32.const 16))
 (global $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/I64_BYTE_LENGTH i32 (i32.const 8))
 (global $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/I32_BYTE_LENGTH i32 (i32.const 4))
 (global $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/I16_BYTE_LENGTH i32 (i32.const 2))
 (global $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/I8_BYTE_LENGTH i32 (i32.const 1))
 (global $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/BOOLEAN_BYTE_LENGTH i32 (i32.const 1))
 (global $~lib/@btc-vision/btc-runtime/runtime/env/consensus/MLDSAMetadata/MLDSASecurityLevel.Level2 i32 (i32.const 0))
 (global $~lib/@btc-vision/btc-runtime/runtime/env/consensus/MLDSAMetadata/MLDSASecurityLevel.Level3 i32 (i32.const 1))
 (global $~lib/@btc-vision/btc-runtime/runtime/env/consensus/MLDSAMetadata/MLDSASecurityLevel.Level5 i32 (i32.const 2))
 (global $~lib/@btc-vision/btc-runtime/runtime/env/consensus/MLDSAMetadata/MLDSAPublicKeyMetadata.MLDSA44 i32 (i32.const 1312))
 (global $~lib/@btc-vision/btc-runtime/runtime/env/consensus/MLDSAMetadata/MLDSAPublicKeyMetadata.MLDSA65 i32 (i32.const 1952))
 (global $~lib/@btc-vision/btc-runtime/runtime/env/consensus/MLDSAMetadata/MLDSAPublicKeyMetadata.MLDSA87 i32 (i32.const 2592))
 (global $~lib/@btc-vision/btc-runtime/runtime/env/consensus/MLDSAMetadata/MLDSA44_PUBLIC_KEY_LEN i32 (i32.const 1312))
 (global $~lib/@btc-vision/btc-runtime/runtime/env/consensus/MLDSAMetadata/MLDSA65_PUBLIC_KEY_LEN i32 (i32.const 1952))
 (global $~lib/@btc-vision/btc-runtime/runtime/env/consensus/MLDSAMetadata/MLDSA87_PUBLIC_KEY_LEN i32 (i32.const 2592))
 (global $~lib/@btc-vision/btc-runtime/runtime/env/consensus/MLDSAMetadata/MLDSA44_PRIVATE_KEY_LEN i32 (i32.const 2560))
 (global $~lib/@btc-vision/btc-runtime/runtime/env/consensus/MLDSAMetadata/MLDSA65_PRIVATE_KEY_LEN i32 (i32.const 4032))
 (global $~lib/@btc-vision/btc-runtime/runtime/env/consensus/MLDSAMetadata/MLDSA87_PRIVATE_KEY_LEN i32 (i32.const 4896))
 (global $~lib/@btc-vision/btc-runtime/runtime/env/consensus/MLDSAMetadata/MLDSA44_SIGNATURE_LEN i32 (i32.const 2420))
 (global $~lib/@btc-vision/btc-runtime/runtime/env/consensus/MLDSAMetadata/MLDSA65_SIGNATURE_LEN i32 (i32.const 3309))
 (global $~lib/@btc-vision/btc-runtime/runtime/env/consensus/MLDSAMetadata/MLDSA87_SIGNATURE_LEN i32 (i32.const 4627))
 (global $~lib/@btc-vision/btc-runtime/runtime/env/Atomic/Atomics.OK i32 (i32.const 0))
 (global $~lib/@btc-vision/btc-runtime/runtime/env/Atomic/Atomics.TIMED_OUT i32 (i32.const 1))
 (global $~lib/@btc-vision/btc-runtime/runtime/env/Atomic/Atomics.NOT_EQUAL i32 (i32.const 2))
 (global $~lib/@btc-vision/btc-runtime/runtime/env/Atomic/Atomics.NOT_AUTHORIZED i32 (i32.const 3))
 (global $~lib/@btc-vision/btc-runtime/runtime/env/Atomic/Atomics.FAULT i32 (i32.const -1))
 (global $~lib/native/ASC_RUNTIME i32 (i32.const 0))
 (global $~lib/@btc-vision/btc-runtime/runtime/types/Address/ZERO_ADDRESS (mut i32) (i32.const 0))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Networks/Networks.Unknown i32 (i32.const -1))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Networks/Networks.Mainnet i32 (i32.const 0))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Networks/Networks.Testnet i32 (i32.const 1))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Networks/Networks.Regtest i32 (i32.const 2))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Networks/Network (mut i32) (i32.const 0))
 (global $~lib/@btc-vision/btc-runtime/runtime/math/bytes/EMPTY_BUFFER (mut i32) (i32.const 0))
 (global $~lib/@btc-vision/btc-runtime/runtime/math/bytes/EMPTY_POINTER (mut i32) (i32.const 0))
 (global $~lib/@btc-vision/btc-runtime/runtime/math/bytes/ONE_BUFFER (mut i32) (i32.const 0))
 (global $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/arrayTooLargeError i32 (i32.const 3696))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Bech32/Bech32.CHARSET i32 (i32.const 3760))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Bech32/Bech32.decodeTbl (mut i32) (i32.const 0))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_FALSE i32 (i32.const 0))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_0 i32 (i32.const 0))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_PUSHDATA1 i32 (i32.const 76))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_PUSHDATA2 i32 (i32.const 77))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_PUSHDATA4 i32 (i32.const 78))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_1NEGATE i32 (i32.const 79))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_RESERVED i32 (i32.const 80))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_TRUE i32 (i32.const 81))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_1 i32 (i32.const 81))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_2 i32 (i32.const 82))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_3 i32 (i32.const 83))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_4 i32 (i32.const 84))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_5 i32 (i32.const 85))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_6 i32 (i32.const 86))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_7 i32 (i32.const 87))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_8 i32 (i32.const 88))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_9 i32 (i32.const 89))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_10 i32 (i32.const 90))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_11 i32 (i32.const 91))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_12 i32 (i32.const 92))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_13 i32 (i32.const 93))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_14 i32 (i32.const 94))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_15 i32 (i32.const 95))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_16 i32 (i32.const 96))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_NOP i32 (i32.const 97))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_VER i32 (i32.const 98))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_IF i32 (i32.const 99))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_NOTIF i32 (i32.const 100))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_VERIF i32 (i32.const 101))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_VERNOTIF i32 (i32.const 102))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_ELSE i32 (i32.const 103))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_ENDIF i32 (i32.const 104))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_VERIFY i32 (i32.const 105))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_RETURN i32 (i32.const 106))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_TOALTSTACK i32 (i32.const 107))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_FROMALTSTACK i32 (i32.const 108))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_2DROP i32 (i32.const 109))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_2DUP i32 (i32.const 110))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_3DUP i32 (i32.const 111))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_2OVER i32 (i32.const 112))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_2ROT i32 (i32.const 113))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_2SWAP i32 (i32.const 114))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_IFDUP i32 (i32.const 115))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_DEPTH i32 (i32.const 116))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_DROP i32 (i32.const 117))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_DUP i32 (i32.const 118))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_NIP i32 (i32.const 119))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_OVER i32 (i32.const 120))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_PICK i32 (i32.const 121))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_ROLL i32 (i32.const 122))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_ROT i32 (i32.const 123))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_SWAP i32 (i32.const 124))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_TUCK i32 (i32.const 125))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_CAT i32 (i32.const 126))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_SUBSTR i32 (i32.const 127))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_LEFT i32 (i32.const 128))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_RIGHT i32 (i32.const 129))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_SIZE i32 (i32.const 130))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_INVERT i32 (i32.const 131))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_AND i32 (i32.const 132))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_OR i32 (i32.const 133))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_XOR i32 (i32.const 134))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_EQUAL i32 (i32.const 135))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_EQUALVERIFY i32 (i32.const 136))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_RESERVED1 i32 (i32.const 137))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_RESERVED2 i32 (i32.const 138))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_1ADD i32 (i32.const 139))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_1SUB i32 (i32.const 140))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_2MUL i32 (i32.const 141))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_2DIV i32 (i32.const 142))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_NEGATE i32 (i32.const 143))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_ABS i32 (i32.const 144))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_NOT i32 (i32.const 145))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_0NOTEQUAL i32 (i32.const 146))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_ADD i32 (i32.const 147))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_SUB i32 (i32.const 148))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_MUL i32 (i32.const 149))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_DIV i32 (i32.const 150))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_MOD i32 (i32.const 151))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_LSHIFT i32 (i32.const 152))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_RSHIFT i32 (i32.const 153))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_BOOLAND i32 (i32.const 154))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_BOOLOR i32 (i32.const 155))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_NUMEQUAL i32 (i32.const 156))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_NUMEQUALVERIFY i32 (i32.const 157))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_NUMNOTEQUAL i32 (i32.const 158))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_LESSTHAN i32 (i32.const 159))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_GREATERTHAN i32 (i32.const 160))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_LESSTHANOREQUAL i32 (i32.const 161))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_GREATERTHANOREQUAL i32 (i32.const 162))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_MIN i32 (i32.const 163))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_MAX i32 (i32.const 164))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_WITHIN i32 (i32.const 165))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_RIPEMD160 i32 (i32.const 166))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_SHA1 i32 (i32.const 167))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_SHA256 i32 (i32.const 168))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_HASH160 i32 (i32.const 169))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_HASH256 i32 (i32.const 170))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_CODESEPARATOR i32 (i32.const 171))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_CHECKSIG i32 (i32.const 172))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_CHECKSIGVERIFY i32 (i32.const 173))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_CHECKMULTISIG i32 (i32.const 174))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_CHECKMULTISIGVERIFY i32 (i32.const 175))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_NOP1 i32 (i32.const 176))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_NOP2 i32 (i32.const 177))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_CHECKLOCKTIMEVERIFY i32 (i32.const 177))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_NOP3 i32 (i32.const 178))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_CHECKSEQUENCEVERIFY i32 (i32.const 178))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_NOP4 i32 (i32.const 179))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_NOP5 i32 (i32.const 180))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_NOP6 i32 (i32.const 181))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_NOP7 i32 (i32.const 182))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_NOP8 i32 (i32.const 183))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_NOP9 i32 (i32.const 184))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_NOP10 i32 (i32.const 185))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_CHECKSIGADD i32 (i32.const 186))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_PUBKEYHASH i32 (i32.const 253))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_PUBKEY i32 (i32.const 254))
 (global $~lib/@btc-vision/btc-runtime/runtime/script/Opcodes/BitcoinOpcodes.OP_INVALIDOPCODE i32 (i32.const 255))
 (global $~lib/@btc-vision/btc-runtime/runtime/types/ExtendedAddressCache/_cachedDeadAddress (mut i32) (i32.const 0))
 (global $~lib/@btc-vision/btc-runtime/runtime/types/ExtendedAddressCache/_cachedZeroAddress (mut i32) (i32.const 0))
 (global $~lib/@btc-vision/btc-runtime/runtime/types/ExtendedAddressCache/DEAD_ARRAY i32 (i32.const 3920))
 (global $~lib/@btc-vision/btc-runtime/runtime/types/ExtendedAddressCache/ZERO_ARRAY i32 (i32.const 4032))
 (global $~lib/@btc-vision/btc-runtime/runtime/types/ExtendedAddress/ZERO_BITCOIN_ADDRESS (mut i32) (i32.const 0))
 (global $~lib/@btc-vision/btc-runtime/runtime/types/ExtendedAddress/DEAD_ADDRESS (mut i32) (i32.const 0))
 (global $~lib/@btc-vision/btc-runtime/runtime/events/NetEvent/MAX_EVENT_DATA_SIZE i32 (i32.const 352))
 (global $~lib/@btc-vision/btc-runtime/runtime/env/enums/TransactionFlags/TransactionInputFlags.hasCoinbase i32 (i32.const 1))
 (global $~lib/@btc-vision/btc-runtime/runtime/env/enums/TransactionFlags/TransactionInputFlags.hasWitnesses i32 (i32.const 2))
 (global $~lib/@btc-vision/btc-runtime/runtime/env/enums/TransactionFlags/TransactionOutputFlags.hasTo i32 (i32.const 1))
 (global $~lib/@btc-vision/btc-runtime/runtime/env/enums/TransactionFlags/TransactionOutputFlags.hasScriptPubKey i32 (i32.const 2))
 (global $~lib/@btc-vision/btc-runtime/runtime/env/enums/TransactionFlags/TransactionOutputFlags.OP_RETURN i32 (i32.const 4))
 (global $~lib/@btc-vision/btc-runtime/runtime/env/consensus/ConsensusRules/ConsensusRules.NONE i64 (i64.const 0))
 (global $~lib/@btc-vision/btc-runtime/runtime/env/consensus/ConsensusRules/ConsensusRules.UNSAFE_QUANTUM_SIGNATURES_ALLOWED i64 (i64.const 1))
 (global $~lib/@btc-vision/btc-runtime/runtime/env/consensus/ConsensusRules/ConsensusRules.RESERVED_FLAG_1 i64 (i64.const 2))
 (global $~lib/@btc-vision/btc-runtime/runtime/env/consensus/ConsensusRules/ConsensusRules.RESERVED_FLAG_2 i64 (i64.const 4))
 (global $~lib/@btc-vision/btc-runtime/runtime/env/consensus/Signatures/SignaturesMethods.ECDSA i32 (i32.const 0))
 (global $~lib/@btc-vision/btc-runtime/runtime/env/consensus/Signatures/SignaturesMethods.Schnorr i32 (i32.const 1))
 (global $~lib/@btc-vision/btc-runtime/runtime/env/consensus/Signatures/SignaturesMethods.MLDSA i32 (i32.const 2))
 (global $~lib/@btc-vision/btc-runtime/runtime/env/consensus/Signatures/ECDSAKeyFormat.Compressed i32 (i32.const 0))
 (global $~lib/@btc-vision/btc-runtime/runtime/env/consensus/Signatures/ECDSAKeyFormat.Uncompressed i32 (i32.const 1))
 (global $~lib/@btc-vision/btc-runtime/runtime/env/consensus/Signatures/ECDSAKeyFormat.Hybrid i32 (i32.const 2))
 (global $~lib/@btc-vision/btc-runtime/runtime/env/consensus/Signatures/ECDSAKeyFormat.Raw i32 (i32.const 3))
 (global $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/SCRATCH_SIZE i32 (i32.const 256))
 (global $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/SCRATCH_BUF (mut i32) (i32.const 0))
 (global $~argumentsLength (mut i32) (i32.const 0))
 (global $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/SCRATCH_VIEW (mut i32) (i32.const 0))
 (global $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/FOUR_BYTES_UINT8ARRAY_MEMORY_CACHE (mut i32) (i32.const 0))
 (global $~lib/builtins/i32.MAX_VALUE i32 (i32.const 2147483647))
 (global $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain (mut i32) (i32.const 0))
 (global $~lib/@btc-vision/btc-runtime/runtime/constants/Exports/ON_OP20_RECEIVED_SELECTOR i32 (i32.const -666993220))
 (global $~lib/@btc-vision/btc-runtime/runtime/constants/Exports/ALLOWANCE_INCREASE_TYPE_HASH i32 (i32.const 4512))
 (global $~lib/@btc-vision/btc-runtime/runtime/constants/Exports/ALLOWANCE_DECREASE_TYPE_HASH i32 (i32.const 4624))
 (global $~lib/@btc-vision/btc-runtime/runtime/constants/Exports/ON_OP721_RECEIVED_SELECTOR i32 (i32.const 1397356254))
 (global $~lib/@btc-vision/btc-runtime/runtime/constants/Exports/ON_OP1155_RECEIVED_MAGIC i32 (i32.const -824401953))
 (global $~lib/@btc-vision/btc-runtime/runtime/constants/Exports/ON_OP1155_BATCH_RECEIVED_MAGIC i32 (i32.const 1570067551))
 (global $~lib/@btc-vision/btc-runtime/runtime/constants/Exports/INTERFACE_ID_OP1155 i32 (i32.const 943502677))
 (global $~lib/@btc-vision/btc-runtime/runtime/constants/Exports/INTERFACE_ID_OP1155_METADATA_URI i32 (i32.const 826752852))
 (global $~lib/@btc-vision/btc-runtime/runtime/constants/Exports/INTERFACE_ID_ERC165 i32 (i32.const 237731810))
 (global $~lib/@btc-vision/btc-runtime/runtime/constants/Exports/OP1155_TRANSFER_TYPE_HASH i32 (i32.const 4736))
 (global $~lib/@btc-vision/btc-runtime/runtime/constants/Exports/OP1155_BATCH_TRANSFER_TYPE_HASH i32 (i32.const 4848))
 (global $~lib/@btc-vision/btc-runtime/runtime/constants/Exports/OP712_DOMAIN_TYPE_HASH i32 (i32.const 4960))
 (global $~lib/@btc-vision/btc-runtime/runtime/constants/Exports/OP712_VERSION_HASH i32 (i32.const 5072))
 (global $~lib/@btc-vision/btc-runtime/runtime/constants/Exports/OP721_APPROVAL_TYPE_HASH i32 (i32.const 5184))
 (global $~lib/@btc-vision/btc-runtime/runtime/constants/Exports/OP721_APPROVAL_FOR_ALL_TYPE_HASH i32 (i32.const 5296))
 (global $~lib/@btc-vision/btc-runtime/runtime/constants/Exports/OP721_TRANSFER_TYPE_HASH i32 (i32.const 5408))
 (global $~lib/@btc-vision/btc-runtime/runtime/constants/Exports/BALANCE_OF_SELECTOR i32 (i32.const 1531377910))
 (global $~lib/@btc-vision/btc-runtime/runtime/constants/Exports/ALLOWANCE_SELECTOR i32 (i32.const -664487990))
 (global $~lib/@btc-vision/btc-runtime/runtime/constants/Exports/TOTAL_SUPPLY_SELECTOR i32 (i32.const -1553464786))
 (global $~lib/@btc-vision/btc-runtime/runtime/constants/Exports/NAME_SELECTOR i32 (i32.const 360839196))
 (global $~lib/@btc-vision/btc-runtime/runtime/constants/Exports/SYMBOL_SELECTOR i32 (i32.const 630619301))
 (global $~lib/@btc-vision/btc-runtime/runtime/constants/Exports/DECIMALS_SELECTOR i32 (i32.const -1148959680))
 (global $~lib/@btc-vision/btc-runtime/runtime/constants/Exports/NONCE_OF_SELECTOR i32 (i32.const -159233179))
 (global $~lib/@btc-vision/btc-runtime/runtime/constants/Exports/DOMAIN_SEPARATOR_SELECTOR i32 (i32.const -239107872))
 (global $~lib/@btc-vision/btc-runtime/runtime/constants/Exports/METADATA_SELECTOR i32 (i32.const -66252452))
 (global $~lib/@btc-vision/btc-runtime/runtime/constants/Exports/MAXIMUM_SUPPLY_SELECTOR i32 (i32.const 2106413081))
 (global $~lib/@btc-vision/btc-runtime/runtime/constants/Exports/ICON_SELECTOR i32 (i32.const -1431678779))
 (global $~lib/@btc-vision/btc-runtime/runtime/events/predefined/URIEvent/MAX_URI_LENGTH i32 (i32.const 200))
 (global $~lib/@btc-vision/btc-runtime/runtime/types/SafeMath/SafeMath.ZERO (mut i32) (i32.const 0))
 (global $~lib/@btc-vision/btc-runtime/runtime/types/SafeMath/SafeMath.ONE (mut i32) (i32.const 0))
 (global $~lib/@btc-vision/btc-runtime/runtime/types/SafeMath/SafeMath.CONST_2 (mut i32) (i32.const 0))
 (global $~lib/@btc-vision/btc-runtime/runtime/types/SafeMath/SafeMath.CONST_3 (mut i32) (i32.const 0))
 (global $~lib/@btc-vision/btc-runtime/runtime/types/SafeMath/SafeMath.CONST_10 (mut i32) (i32.const 0))
 (global $~lib/@btc-vision/btc-runtime/runtime/types/SafeMath/SafeMath.LN2_SCALED i64 (i64.const 693147))
 (global $~lib/@btc-vision/btc-runtime/runtime/types/SafeMath/SafeMath.SCALE_1E6 i64 (i64.const 1000000))
 (global $~lib/builtins/u32.MAX_VALUE i32 (i32.const -1))
 (global $~lib/@btc-vision/btc-runtime/runtime/storage/StoredString/StoredString.DEFAULT_MAX_LENGTH i32 (i32.const -1))
 (global $~lib/@btc-vision/btc-runtime/runtime/storage/StoredString/StoredString.MAX_LENGTH_U256 (mut i32) (i32.const 0))
 (global $~lib/builtins/u16.MAX_VALUE i32 (i32.const 65535))
 (global $~lib/@btc-vision/btc-runtime/runtime/contracts/ReentrancyGuard/statusPointer (mut i32) (i32.const 0))
 (global $~lib/@btc-vision/btc-runtime/runtime/contracts/ReentrancyGuard/depthPointer (mut i32) (i32.const 0))
 (global $~lib/@btc-vision/btc-runtime/runtime/contracts/ReentrancyGuard/ReentrancyLevel.STANDARD i32 (i32.const 0))
 (global $~lib/@btc-vision/btc-runtime/runtime/contracts/ReentrancyGuard/ReentrancyLevel.CALLBACK i32 (i32.const 1))
 (global $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/namePointer (mut i32) (i32.const 0))
 (global $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/symbolPointer (mut i32) (i32.const 0))
 (global $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/iconPointer (mut i32) (i32.const 0))
 (global $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/decimalsPointer (mut i32) (i32.const 0))
 (global $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/totalSupplyPointer (mut i32) (i32.const 0))
 (global $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/maxSupplyPointer (mut i32) (i32.const 0))
 (global $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/balanceOfMapPointer (mut i32) (i32.const 0))
 (global $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/allowanceMapPointer (mut i32) (i32.const 0))
 (global $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/nonceMapPointer (mut i32) (i32.const 0))
 (global $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20S/PEG_RATE_SELECTOR i32 (i32.const 1293905071))
 (global $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20S/PEG_AUTHORITY_SELECTOR i32 (i32.const -681073277))
 (global $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20S/PEG_UPDATED_AT_SELECTOR i32 (i32.const 513397153))
 (global $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20S/MAX_STALENESS_SELECTOR i32 (i32.const 186099202))
 (global $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20S/IS_STALE_SELECTOR i32 (i32.const 343673071))
 (global $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20S/pegRatePointer (mut i32) (i32.const 0))
 (global $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20S/pegAuthorityPointer (mut i32) (i32.const 0))
 (global $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20S/pegUpdatedAtPointer (mut i32) (i32.const 0))
 (global $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20S/maxStalenessPointer (mut i32) (i32.const 0))
 (global $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20S/pendingAuthorityPointer (mut i32) (i32.const 0))
 (global $~lib/@btc-vision/btc-runtime/runtime/types/SafeMathI128/SafeMathI128.ZERO (mut i32) (i32.const 0))
 (global $~lib/@btc-vision/btc-runtime/runtime/types/SafeMathI128/SafeMathI128.ONE (mut i32) (i32.const 0))
 (global $~lib/@btc-vision/btc-runtime/runtime/types/SafeMathI128/SafeMathI128.NEG_ONE (mut i32) (i32.const 0))
 (global $~lib/@btc-vision/btc-runtime/runtime/types/SafeMathI128/SafeMathI128.MIN (mut i32) (i32.const 0))
 (global $~lib/builtins/u64.MAX_VALUE i64 (i64.const -1))
 (global $~lib/@btc-vision/btc-runtime/runtime/types/SafeMathI128/SafeMathI128.MAX (mut i32) (i32.const 0))
 (global $~lib/@btc-vision/btc-runtime/runtime/secp256k1/ECPoint/P_BYTES i32 (i32.const 5760))
 (global $~lib/@btc-vision/btc-runtime/runtime/secp256k1/ECPoint/GX_BYTES i32 (i32.const 5872))
 (global $~lib/@btc-vision/btc-runtime/runtime/secp256k1/ECPoint/GY_BYTES i32 (i32.const 5984))
 (global $~lib/@btc-vision/btc-runtime/runtime/secp256k1/ECPoint/P (mut i32) (i32.const 0))
 (global $~lib/@btc-vision/btc-runtime/runtime/secp256k1/ECPoint/GX (mut i32) (i32.const 0))
 (global $~lib/@btc-vision/btc-runtime/runtime/secp256k1/ECPoint/GY (mut i32) (i32.const 0))
 (global $~lib/@btc-vision/btc-runtime/runtime/storage/arrays/StoredPackedArray/DEFAULT_MAX_LENGTH i32 (i32.const -2))
 (global $~lib/@btc-vision/btc-runtime/runtime/shared-libraries/TransferHelper/transferSignature i32 (i32.const 6160))
 (global $~lib/@btc-vision/btc-runtime/runtime/shared-libraries/TransferHelper/transferFromSignature i32 (i32.const 6240))
 (global $~lib/@btc-vision/btc-runtime/runtime/shared-libraries/TransferHelper/SafeTransferSignature i32 (i32.const 6336))
 (global $~lib/@btc-vision/btc-runtime/runtime/shared-libraries/TransferHelper/SafeTransferFromSignature i32 (i32.const 6432))
 (global $~lib/@btc-vision/btc-runtime/runtime/shared-libraries/TransferHelper/IncreaseAllowanceSignature i32 (i32.const 6560))
 (global $~lib/@btc-vision/btc-runtime/runtime/shared-libraries/TransferHelper/DecreaseAllowanceSignature i32 (i32.const 6656))
 (global $~lib/@btc-vision/btc-runtime/runtime/shared-libraries/TransferHelper/BurnSignature i32 (i32.const 6752))
 (global $~lib/@btc-vision/btc-runtime/runtime/hashing/keccak256/RC_HI i32 (i32.const 6928))
 (global $~lib/@btc-vision/btc-runtime/runtime/hashing/keccak256/RC_LO i32 (i32.const 7104))
 (global $~lib/@btc-vision/btc-runtime/runtime/hashing/keccak256/ROTC i32 (i32.const 7280))
 (global $~lib/@btc-vision/btc-runtime/runtime/hashing/keccak256/PILN i32 (i32.const 7456))
 (global $~lib/@btc-vision/btc-runtime/runtime/contracts/OP721/stringPointer (mut i32) (i32.const 0))
 (global $~lib/@btc-vision/btc-runtime/runtime/contracts/OP721/totalSupplyPointer (mut i32) (i32.const 0))
 (global $~lib/@btc-vision/btc-runtime/runtime/contracts/OP721/maxSupplyPointer (mut i32) (i32.const 0))
 (global $~lib/@btc-vision/btc-runtime/runtime/contracts/OP721/ownerOfMapPointer (mut i32) (i32.const 0))
 (global $~lib/@btc-vision/btc-runtime/runtime/contracts/OP721/tokenApprovalMapPointer (mut i32) (i32.const 0))
 (global $~lib/@btc-vision/btc-runtime/runtime/contracts/OP721/operatorApprovalMapPointer (mut i32) (i32.const 0))
 (global $~lib/@btc-vision/btc-runtime/runtime/contracts/OP721/balanceOfMapPointer (mut i32) (i32.const 0))
 (global $~lib/@btc-vision/btc-runtime/runtime/contracts/OP721/tokenURIMapPointer (mut i32) (i32.const 0))
 (global $~lib/@btc-vision/btc-runtime/runtime/contracts/OP721/nextTokenIdPointer (mut i32) (i32.const 0))
 (global $~lib/@btc-vision/btc-runtime/runtime/contracts/OP721/ownerTokensMapPointer (mut i32) (i32.const 0))
 (global $~lib/@btc-vision/btc-runtime/runtime/contracts/OP721/tokenIndexMapPointer (mut i32) (i32.const 0))
 (global $~lib/@btc-vision/btc-runtime/runtime/contracts/OP721/initializedPointer (mut i32) (i32.const 0))
 (global $~lib/@btc-vision/btc-runtime/runtime/contracts/OP721/tokenURICounterPointer (mut i32) (i32.const 0))
 (global $~lib/@btc-vision/btc-runtime/runtime/contracts/OP721/approveNonceMapPointer (mut i32) (i32.const 0))
 (global $~lib/@btc-vision/btc-runtime/runtime/contracts/Upgradeable/pendingUpgradeAddressPointer (mut i32) (i32.const 0))
 (global $~lib/@btc-vision/btc-runtime/runtime/contracts/Upgradeable/pendingUpgradeBlockPointer (mut i32) (i32.const 0))
 (global $src/wrapped/husdt/HUSDT/bridgeAuthorityPointer (mut i32) (i32.const 0))
 (global $~lib/@btc-vision/as-bignum/assembly/globals/__res128_hi (mut i64) (i64.const 0))
 (global $~lib/@btc-vision/as-bignum/assembly/globals/__u256carry (mut i64) (i64.const 0))
 (global $~lib/@btc-vision/as-bignum/assembly/globals/__u256carrySub (mut i64) (i64.const 0))
 (global $~lib/@btc-vision/btc-runtime/runtime/exports/index/ENVIRONMENT_VARIABLES_BYTE_LENGTH i32 (i32.const 512))
 (global $~lib/rt/__rtti_base i32 (i32.const 17008))
 (global $~lib/memory/__heap_base i32 (i32.const 17272))
 (memory $0 1)
 (data $0 (i32.const 12) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\n\00\00\00a\00b\00o\00r\00t\00\00\00")
 (data $1 (i32.const 44) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\08\00\00\00 \00i\00n\00 \00\00\00\00\00")
 (data $2 (i32.const 76) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $3 (i32.const 108) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\02\00\00\00:\00\00\00\00\00\00\00\00\00\00\00")
 (data $4 (i32.const 140) "|\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00d\00\00\00t\00o\00S\00t\00r\00i\00n\00g\00(\00)\00 \00r\00a\00d\00i\00x\00 \00a\00r\00g\00u\00m\00e\00n\00t\00 \00m\00u\00s\00t\00 \00b\00e\00 \00b\00e\00t\00w\00e\00e\00n\00 \002\00 \00a\00n\00d\00 \003\006\00\00\00\00\00\00\00\00\00")
 (data $5 (i32.const 268) "<\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00&\00\00\00~\00l\00i\00b\00/\00u\00t\00i\00l\00/\00n\00u\00m\00b\00e\00r\00.\00t\00s\00\00\00\00\00\00\00")
 (data $6 (i32.const 332) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\02\00\00\000\00\00\00\00\00\00\00\00\00\00\00")
 (data $7 (i32.const 364) "0\000\000\001\000\002\000\003\000\004\000\005\000\006\000\007\000\008\000\009\001\000\001\001\001\002\001\003\001\004\001\005\001\006\001\007\001\008\001\009\002\000\002\001\002\002\002\003\002\004\002\005\002\006\002\007\002\008\002\009\003\000\003\001\003\002\003\003\003\004\003\005\003\006\003\007\003\008\003\009\004\000\004\001\004\002\004\003\004\004\004\005\004\006\004\007\004\008\004\009\005\000\005\001\005\002\005\003\005\004\005\005\005\006\005\007\005\008\005\009\006\000\006\001\006\002\006\003\006\004\006\005\006\006\006\007\006\008\006\009\007\000\007\001\007\002\007\003\007\004\007\005\007\006\007\007\007\008\007\009\008\000\008\001\008\002\008\003\008\004\008\005\008\006\008\007\008\008\008\009\009\000\009\001\009\002\009\003\009\004\009\005\009\006\009\007\009\008\009\009\00")
 (data $8 (i32.const 764) "\1c\04\00\00\00\00\00\00\00\00\00\00\02\00\00\00\00\04\00\000\000\000\001\000\002\000\003\000\004\000\005\000\006\000\007\000\008\000\009\000\00a\000\00b\000\00c\000\00d\000\00e\000\00f\001\000\001\001\001\002\001\003\001\004\001\005\001\006\001\007\001\008\001\009\001\00a\001\00b\001\00c\001\00d\001\00e\001\00f\002\000\002\001\002\002\002\003\002\004\002\005\002\006\002\007\002\008\002\009\002\00a\002\00b\002\00c\002\00d\002\00e\002\00f\003\000\003\001\003\002\003\003\003\004\003\005\003\006\003\007\003\008\003\009\003\00a\003\00b\003\00c\003\00d\003\00e\003\00f\004\000\004\001\004\002\004\003\004\004\004\005\004\006\004\007\004\008\004\009\004\00a\004\00b\004\00c\004\00d\004\00e\004\00f\005\000\005\001\005\002\005\003\005\004\005\005\005\006\005\007\005\008\005\009\005\00a\005\00b\005\00c\005\00d\005\00e\005\00f\006\000\006\001\006\002\006\003\006\004\006\005\006\006\006\007\006\008\006\009\006\00a\006\00b\006\00c\006\00d\006\00e\006\00f\007\000\007\001\007\002\007\003\007\004\007\005\007\006\007\007\007\008\007\009\007\00a\007\00b\007\00c\007\00d\007\00e\007\00f\008\000\008\001\008\002\008\003\008\004\008\005\008\006\008\007\008\008\008\009\008\00a\008\00b\008\00c\008\00d\008\00e\008\00f\009\000\009\001\009\002\009\003\009\004\009\005\009\006\009\007\009\008\009\009\009\00a\009\00b\009\00c\009\00d\009\00e\009\00f\00a\000\00a\001\00a\002\00a\003\00a\004\00a\005\00a\006\00a\007\00a\008\00a\009\00a\00a\00a\00b\00a\00c\00a\00d\00a\00e\00a\00f\00b\000\00b\001\00b\002\00b\003\00b\004\00b\005\00b\006\00b\007\00b\008\00b\009\00b\00a\00b\00b\00b\00c\00b\00d\00b\00e\00b\00f\00c\000\00c\001\00c\002\00c\003\00c\004\00c\005\00c\006\00c\007\00c\008\00c\009\00c\00a\00c\00b\00c\00c\00c\00d\00c\00e\00c\00f\00d\000\00d\001\00d\002\00d\003\00d\004\00d\005\00d\006\00d\007\00d\008\00d\009\00d\00a\00d\00b\00d\00c\00d\00d\00d\00e\00d\00f\00e\000\00e\001\00e\002\00e\003\00e\004\00e\005\00e\006\00e\007\00e\008\00e\009\00e\00a\00e\00b\00e\00c\00e\00d\00e\00e\00e\00f\00f\000\00f\001\00f\002\00f\003\00f\004\00f\005\00f\006\00f\007\00f\008\00f\009\00f\00a\00f\00b\00f\00c\00f\00d\00f\00e\00f\00f\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $9 (i32.const 1820) "\\\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00H\00\00\000\001\002\003\004\005\006\007\008\009\00a\00b\00c\00d\00e\00f\00g\00h\00i\00j\00k\00l\00m\00n\00o\00p\00q\00r\00s\00t\00u\00v\00w\00x\00y\00z\00\00\00\00\00")
 (data $10 (i32.const 1916) "<\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00 \00\00\00~\00l\00i\00b\00/\00b\00u\00i\00l\00t\00i\00n\00s\00.\00t\00s\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $11 (i32.const 1980) "<\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00(\00\00\00A\00l\00l\00o\00c\00a\00t\00i\00o\00n\00 \00t\00o\00o\00 \00l\00a\00r\00g\00e\00\00\00\00\00")
 (data $12 (i32.const 2044) "<\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\1e\00\00\00~\00l\00i\00b\00/\00r\00t\00/\00s\00t\00u\00b\00.\00t\00s\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $13 (i32.const 2108) "\1c\02\00\00\00\00\00\00\00\00\00\00\05\00\00\00\00\02\00\00000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f202122232425262728292a2b2c2d2e2f303132333435363738393a3b3c3d3e3f404142434445464748494a4b4c4d4e4f505152535455565758595a5b5c5d5e5f606162636465666768696a6b6c6d6e6f707172737475767778797a7b7c7d7e7f808182838485868788898a8b8c8d8e8f909192939495969798999a9b9c9d9e9fa0a1a2a3a4a5a6a7a8a9aaabacadaeafb0b1b2b3b4b5b6b7b8b9babbbcbdbebfc0c1c2c3c4c5c6c7c8c9cacbcccdcecfd0d1d2d3d4d5d6d7d8d9dadbdcdddedfe0e1e2e3e4e5e6e7e8e9eaebecedeeeff0f1f2f3f4f5f6f7f8f9fafbfcfdfeff\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $14 (i32.const 2652) ",\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\1c\00\00\00I\00n\00v\00a\00l\00i\00d\00 \00l\00e\00n\00g\00t\00h\00")
 (data $15 (i32.const 2700) "<\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00&\00\00\00~\00l\00i\00b\00/\00a\00r\00r\00a\00y\00b\00u\00f\00f\00e\00r\00.\00t\00s\00\00\00\00\00\00\00")
 (data $16 (i32.const 2764) "L\00\00\00\00\00\00\00\00\00\00\00\02\00\00\006\00\00\00I\00n\00v\00a\00l\00i\00d\00 \00p\00u\00b\00l\00i\00c\00 \00k\00e\00y\00 \00l\00e\00n\00g\00t\00h\00 \00(\00\00\00\00\00\00\00")
 (data $17 (i32.const 2844) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\02\00\00\00)\00\00\00\00\00\00\00\00\00\00\00")
 (data $18 (i32.const 2876) "\1c\00\00\00\03\00\00\00\00\00\00\00\t\00\00\00\0c\00\00\00\e0\n\00\00\00\00\00\000\0b\00\00")
 (data $19 (i32.const 2908) "|\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00j\00\00\00~\00l\00i\00b\00/\00@\00b\00t\00c\00-\00v\00i\00s\00i\00o\00n\00/\00b\00t\00c\00-\00r\00u\00n\00t\00i\00m\00e\00/\00r\00u\00n\00t\00i\00m\00e\00/\00t\00y\00p\00e\00s\00/\00A\00d\00d\00r\00e\00s\00s\00.\00t\00s\00\00\00")
 (data $20 (i32.const 3036) "<\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00$\00\00\00I\00n\00d\00e\00x\00 \00o\00u\00t\00 \00o\00f\00 \00r\00a\00n\00g\00e\00\00\00\00\00\00\00\00\00")
 (data $21 (i32.const 3100) "<\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00$\00\00\00~\00l\00i\00b\00/\00t\00y\00p\00e\00d\00a\00r\00r\00a\00y\00.\00t\00s\00\00\00\00\00\00\00\00\00")
 (data $22 (i32.const 3164) "\1c\00\00\00\00\00\00\00\00\00\00\00\01\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $23 (i32.const 3196) "\9c\00\00\00\00\00\00\00\00\00\00\00\01\00\00\00\80\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\19\00\00\00\d6\00\00\00h\00\00\00\9c\00\00\00\08\00\00\00Z\00\00\00\e1\00\00\00e\00\00\00\83\00\00\00\1e\00\00\00\93\00\00\00O\00\00\00\f7\00\00\00c\00\00\00\ae\00\00\00F\00\00\00\a2\00\00\00\a6\00\00\00\c1\00\00\00r\00\00\00\b3\00\00\00\f1\00\00\00\b6\00\00\00\n\00\00\00\8c\00\00\00\e2\00\00\00o\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $24 (i32.const 3356) "\9c\00\00\00\00\00\00\00\00\00\00\00\01\00\00\00\80\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\t\00\00\003\00\00\00\ea\00\00\00\01\00\00\00\ad\00\00\00\0e\00\00\00\e9\00\00\00\84\00\00\00 \00\00\00\97\00\00\00y\00\00\00\ba\00\00\00\ae\00\00\00\c3\00\00\00\ce\00\00\00\d9\00\00\00\0f\00\00\00\a3\00\00\00\f4\00\00\00\08\00\00\00q\00\00\00\95\00\00\00&\00\00\00\f8\00\00\00\d7\00\00\00\7f\00\00\00I\00\00\00C\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $25 (i32.const 3516) "\9c\00\00\00\00\00\00\00\00\00\00\00\01\00\00\00\80\00\00\00\0f\00\00\00\91\00\00\00\88\00\00\00\f1\00\00\00<\00\00\00\b7\00\00\00\b2\00\00\00\c7\00\00\00\1f\00\00\00*\00\00\003\00\00\00^\00\00\00:\00\00\00O\00\00\00\c3\00\00\00(\00\00\00\bf\00\00\00[\00\00\00\eb\00\00\00C\00\00\00`\00\00\00\12\00\00\00\af\00\00\00\ca\00\00\00Y\00\00\00\0b\00\00\00\1a\00\00\00\11\00\00\00F\00\00\00n\00\00\00\"\00\00\00\06\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $26 (i32.const 3676) "<\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00$\00\00\00A\00r\00r\00a\00y\00 \00i\00s\00 \00t\00o\00o\00 \00l\00a\00r\00g\00e\00\00\00\00\00\00\00\00\00")
 (data $27 (i32.const 3740) "\\\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00@\00\00\00q\00p\00z\00r\00y\009\00x\008\00g\00f\002\00t\00v\00d\00w\000\00s\003\00j\00n\005\004\00k\00h\00c\00e\006\00m\00u\00a\007\00l\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $28 (i32.const 3836) "<\00\00\00\00\00\00\00\00\00\00\00\01\00\00\00 \00\00\00(J\e4\ac\db2\a9\9b\a3\eb\faf\a9\1d\dbA\a7\b7\a1\d2\fe\f4\159\99\"\cd\8a\04H\\\02\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $29 (i32.const 3900) ",\00\00\00\00\00\00\00\00\00\00\00\08\00\00\00\10\00\00\00\10\0f\00\00\10\0f\00\00 \00\00\00 \00\00\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $30 (i32.const 3948) "<\00\00\00\00\00\00\00\00\00\00\00\01\00\00\00 \00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $31 (i32.const 4012) ",\00\00\00\00\00\00\00\00\00\00\00\08\00\00\00\10\00\00\00\80\0f\00\00\80\0f\00\00 \00\00\00 \00\00\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $32 (i32.const 4060) "l\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00P\00\00\00T\00w\00e\00a\00k\00e\00d\00 \00p\00u\00b\00l\00i\00c\00 \00k\00e\00y\00 \00m\00u\00s\00t\00 \00b\00e\00 \003\002\00 \00b\00y\00t\00e\00s\00 \00l\00o\00n\00g\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $33 (i32.const 4172) "\8c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00z\00\00\00~\00l\00i\00b\00/\00@\00b\00t\00c\00-\00v\00i\00s\00i\00o\00n\00/\00b\00t\00c\00-\00r\00u\00n\00t\00i\00m\00e\00/\00r\00u\00n\00t\00i\00m\00e\00/\00t\00y\00p\00e\00s\00/\00E\00x\00t\00e\00n\00d\00e\00d\00A\00d\00d\00r\00e\00s\00s\00.\00t\00s\00\00\00")
 (data $34 (i32.const 4316) ",\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\1a\00\00\00~\00l\00i\00b\00/\00a\00r\00r\00a\00y\00.\00t\00s\00\00\00")
 (data $35 (i32.const 4364) "\1c\00\00\00\00\00\00\00\00\00\00\00\01\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $36 (i32.const 4396) "\1c\00\00\00\00\00\00\00\00\00\00\00\01\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $37 (i32.const 4428) "<\00\00\00\00\00\00\00\00\00\00\00\01\00\00\00 \00\00\00~\88\02\f1\fd#\e1\0e\r\de?\00\c0\aaH\15\d8\85\ec\d9\cd\a0\dfV\ff\a2^\ccp-E\8e\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $38 (i32.const 4492) ",\00\00\00\00\00\00\00\00\00\00\00\08\00\00\00\10\00\00\00`\11\00\00`\11\00\00 \00\00\00 \00\00\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $39 (i32.const 4540) "<\00\00\00\00\00\00\00\00\00\00\00\01\00\00\00 \00\00\00p\87\994\92\1c/H\17x\87\89w\d5\b4^*Y\da\1d(\"A\c9?\f1\baj\f0\98\fc\d0\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $40 (i32.const 4604) ",\00\00\00\00\00\00\00\00\00\00\00\08\00\00\00\10\00\00\00\d0\11\00\00\d0\11\00\00 \00\00\00 \00\00\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $41 (i32.const 4652) "<\00\00\00\00\00\00\00\00\00\00\00\01\00\00\00 \00\00\00Zd,\a2\d8\fd\e9\e1(\87|\f5]q\96\e3:\d4K\b3K\n\8d\85\8d\a8\04\bd;\86!\0e\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $42 (i32.const 4716) ",\00\00\00\00\00\00\00\00\00\00\00\08\00\00\00\10\00\00\00@\12\00\00@\12\00\00 \00\00\00 \00\00\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $43 (i32.const 4764) "<\00\00\00\00\00\00\00\00\00\00\00\01\00\00\00 \00\00\00{\f8\b69_\ea\cc\15\97\128\00\91\b9+\96gk+sF\ff)\'\bf\1aT\f8\fc\ef\9c\0b\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $44 (i32.const 4828) ",\00\00\00\00\00\00\00\00\00\00\00\08\00\00\00\10\00\00\00\b0\12\00\00\b0\12\00\00 \00\00\00 \00\00\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $45 (i32.const 4876) "<\00\00\00\00\00\00\00\00\00\00\00\01\00\00\00 \00\00\00\fe\e8\"\925\1d\1a\8b\ab!\c4\ef\dd\15~1h\e8\f62:\d0L\ba\12\f7|\0b\dcF\"X\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $46 (i32.const 4940) ",\00\00\00\00\00\00\00\00\00\00\00\08\00\00\00\10\00\00\00 \13\00\00 \13\00\00 \00\00\00 \00\00\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $47 (i32.const 4988) "<\00\00\00\00\00\00\00\00\00\00\00\01\00\00\00 \00\00\00k\86\b2s\ff4\fc\e1\9dk\80N\ffZ?WG\ad\a4\ea\a2/\1dI\c0\1eR\dd\b7\87[K\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $48 (i32.const 5052) ",\00\00\00\00\00\00\00\00\00\00\00\08\00\00\00\10\00\00\00\90\13\00\00\90\13\00\00 \00\00\00 \00\00\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $49 (i32.const 5100) "<\00\00\00\00\00\00\00\00\00\00\00\01\00\00\00 \00\00\00\b8n\99\da\c0GKJ\9f\c32:\d6\ed/9U\e7\b8m\c6\8cbB\82\1c\bc\ac\a2\d8y\de\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $50 (i32.const 5164) ",\00\00\00\00\00\00\00\00\00\00\00\08\00\00\00\10\00\00\00\00\14\00\00\00\14\00\00 \00\00\00 \00\00\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $51 (i32.const 5212) "<\00\00\00\00\00\00\00\00\00\00\00\01\00\00\00 \00\00\00OH\06]\9e\f1E%k\f7\7f\d2\e5\8by\e6\f6\0c\d0\d3Gp\1424P\c9e\b7K\80\ed\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $52 (i32.const 5276) ",\00\00\00\00\00\00\00\00\00\00\00\08\00\00\00\10\00\00\00p\14\00\00p\14\00\00 \00\00\00 \00\00\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $53 (i32.const 5324) "<\00\00\00\00\00\00\00\00\00\00\00\01\00\00\00 \00\00\00\f9\03\d7\be\0c\a4\99\eem}F\"\c7\92\b2\ead\ab\a6\afhQ\03\fe\c4\ae\12\d7\a6\a9\b2\0f\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $54 (i32.const 5388) ",\00\00\00\00\00\00\00\00\00\00\00\08\00\00\00\10\00\00\00\e0\14\00\00\e0\14\00\00 \00\00\00 \00\00\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $55 (i32.const 5436) "L\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00.\00\00\00O\00u\00t\00 \00o\00f\00 \00s\00t\00o\00r\00a\00g\00e\00 \00p\00o\00i\00n\00t\00e\00r\00.\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $56 (i32.const 5516) "\9c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\82\00\00\00~\00l\00i\00b\00/\00@\00b\00t\00c\00-\00v\00i\00s\00i\00o\00n\00/\00b\00t\00c\00-\00r\00u\00n\00t\00i\00m\00e\00/\00r\00u\00n\00t\00i\00m\00e\00/\00e\00n\00v\00/\00B\00l\00o\00c\00k\00c\00h\00a\00i\00n\00E\00n\00v\00i\00r\00o\00n\00m\00e\00n\00t\00.\00t\00s\00\00\00\00\00\00\00\00\00\00\00")
 (data $57 (i32.const 5676) "<\00\00\00\00\00\00\00\00\00\00\00\01\00\00\00 \00\00\00/\fc\ff\ff\fe\ff\ff\ff\ff\ff\ff\ff\ff\ff\ff\ff\ff\ff\ff\ff\ff\ff\ff\ff\ff\ff\ff\ff\ff\ff\ff\ff\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $58 (i32.const 5740) ",\00\00\00\00\00\00\00\00\00\00\00\08\00\00\00\10\00\00\00@\16\00\00@\16\00\00 \00\00\00 \00\00\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $59 (i32.const 5788) "<\00\00\00\00\00\00\00\00\00\00\00\01\00\00\00 \00\00\00\98\17\f8\16\b1[(\d9Y(\ce-\db\fc\9b\02p\b0\87\ce\95\a0bU\ac\bb\dc\f9\eff\bey\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $60 (i32.const 5852) ",\00\00\00\00\00\00\00\00\00\00\00\08\00\00\00\10\00\00\00\b0\16\00\00\b0\16\00\00 \00\00\00 \00\00\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $61 (i32.const 5900) "<\00\00\00\00\00\00\00\00\00\00\00\01\00\00\00 \00\00\00\b8\d4\10\fb\8f\d0G\9c\19T\85\a6H\b4\17\fd\a8\08\11\0e\fc\fb\a4]e\c4\a3&w\da:H\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $62 (i32.const 5964) ",\00\00\00\00\00\00\00\00\00\00\00\08\00\00\00\10\00\00\00 \17\00\00 \17\00\00 \00\00\00 \00\00\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $63 (i32.const 6012) "|\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00f\00\00\00~\00l\00i\00b\00/\00@\00b\00t\00c\00-\00v\00i\00s\00i\00o\00n\00/\00a\00s\00-\00b\00i\00g\00n\00u\00m\00/\00a\00s\00s\00e\00m\00b\00l\00y\00/\00i\00n\00t\00e\00g\00e\00r\00/\00u\002\005\006\00.\00t\00s\00\00\00\00\00\00\00")
 (data $64 (i32.const 6140) "L\00\00\00\00\00\00\00\00\00\00\00\02\00\00\002\00\00\00t\00r\00a\00n\00s\00f\00e\00r\00(\00a\00d\00d\00r\00e\00s\00s\00,\00u\00i\00n\00t\002\005\006\00)\00\00\00\00\00\00\00\00\00\00\00")
 (data $65 (i32.const 6220) "\\\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00J\00\00\00t\00r\00a\00n\00s\00f\00e\00r\00F\00r\00o\00m\00(\00a\00d\00d\00r\00e\00s\00s\00,\00a\00d\00d\00r\00e\00s\00s\00,\00u\00i\00n\00t\002\005\006\00)\00\00\00")
 (data $66 (i32.const 6316) "\\\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00F\00\00\00s\00a\00f\00e\00T\00r\00a\00n\00s\00f\00e\00r\00(\00a\00d\00d\00r\00e\00s\00s\00,\00u\00i\00n\00t\002\005\006\00,\00b\00y\00t\00e\00s\00)\00\00\00\00\00\00\00")
 (data $67 (i32.const 6412) "|\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00^\00\00\00s\00a\00f\00e\00T\00r\00a\00n\00s\00f\00e\00r\00F\00r\00o\00m\00(\00a\00d\00d\00r\00e\00s\00s\00,\00a\00d\00d\00r\00e\00s\00s\00,\00u\00i\00n\00t\002\005\006\00,\00b\00y\00t\00e\00s\00)\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $68 (i32.const 6540) "\\\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00D\00\00\00i\00n\00c\00r\00e\00a\00s\00e\00A\00l\00l\00o\00w\00a\00n\00c\00e\00(\00a\00d\00d\00r\00e\00s\00s\00,\00u\00i\00n\00t\002\005\006\00)\00\00\00\00\00\00\00\00\00")
 (data $69 (i32.const 6636) "\\\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00D\00\00\00d\00e\00c\00r\00e\00a\00s\00e\00A\00l\00l\00o\00w\00a\00n\00c\00e\00(\00a\00d\00d\00r\00e\00s\00s\00,\00u\00i\00n\00t\002\005\006\00)\00\00\00\00\00\00\00\00\00")
 (data $70 (i32.const 6732) ",\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\1a\00\00\00b\00u\00r\00n\00(\00u\00i\00n\00t\002\005\006\00)\00\00\00")
 (data $71 (i32.const 6780) "|\00\00\00\00\00\00\00\00\00\00\00\01\00\00\00`\00\00\00\00\00\00\00\00\00\00\00\00\00\00\80\00\00\00\80\00\00\00\00\00\00\00\00\00\00\00\80\00\00\00\80\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\80\00\00\00\80\00\00\00\80\00\00\00\80\00\00\00\80\00\00\00\00\00\00\00\80\00\00\00\80\00\00\00\80\00\00\00\00\00\00\00\80\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $72 (i32.const 6908) ",\00\00\00\00\00\00\00\00\00\00\00!\00\00\00\10\00\00\00\90\1a\00\00\90\1a\00\00`\00\00\00\18\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $73 (i32.const 6956) "|\00\00\00\00\00\00\00\00\00\00\00\01\00\00\00`\00\00\00\01\00\00\00\82\80\00\00\8a\80\00\00\00\80\00\80\8b\80\00\00\01\00\00\80\81\80\00\80\t\80\00\00\8a\00\00\00\88\00\00\00\t\80\00\80\n\00\00\80\8b\80\00\80\8b\00\00\00\89\80\00\00\03\80\00\00\02\80\00\00\80\00\00\00\n\80\00\00\n\00\00\80\81\80\00\80\80\80\00\00\01\00\00\80\08\80\00\80\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $74 (i32.const 7084) ",\00\00\00\00\00\00\00\00\00\00\00!\00\00\00\10\00\00\00@\1b\00\00@\1b\00\00`\00\00\00\18\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $75 (i32.const 7132) "|\00\00\00\00\00\00\00\00\00\00\00\01\00\00\00`\00\00\00\01\00\00\00\03\00\00\00\06\00\00\00\n\00\00\00\0f\00\00\00\15\00\00\00\1c\00\00\00$\00\00\00-\00\00\007\00\00\00\02\00\00\00\0e\00\00\00\1b\00\00\00)\00\00\008\00\00\00\08\00\00\00\19\00\00\00+\00\00\00>\00\00\00\12\00\00\00\'\00\00\00=\00\00\00\14\00\00\00,\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $76 (i32.const 7260) ",\00\00\00\00\00\00\00\00\00\00\00\n\00\00\00\10\00\00\00\f0\1b\00\00\f0\1b\00\00`\00\00\00\18\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $77 (i32.const 7308) "|\00\00\00\00\00\00\00\00\00\00\00\01\00\00\00`\00\00\00\n\00\00\00\07\00\00\00\0b\00\00\00\11\00\00\00\12\00\00\00\03\00\00\00\05\00\00\00\10\00\00\00\08\00\00\00\15\00\00\00\18\00\00\00\04\00\00\00\0f\00\00\00\17\00\00\00\13\00\00\00\r\00\00\00\0c\00\00\00\02\00\00\00\14\00\00\00\0e\00\00\00\16\00\00\00\t\00\00\00\06\00\00\00\01\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $78 (i32.const 7436) ",\00\00\00\00\00\00\00\00\00\00\00\n\00\00\00\10\00\00\00\a0\1c\00\00\a0\1c\00\00`\00\00\00\18\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $79 (i32.const 7484) "\1c\00\00\00\00\00\00\00\00\00\00\00\01\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $80 (i32.const 7516) ",\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\14\00\00\00S\00t\00o\00r\00e\00d\00U\002\005\006\00\00\00\00\00\00\00\00\00")
 (data $81 (i32.const 7564) "l\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00N\00\00\00P\00o\00i\00n\00t\00e\00r\00s\00 \00m\00u\00s\00t\00 \00b\00e\00 \00e\00x\00a\00c\00t\00l\00y\00 \003\000\00 \00b\00y\00t\00e\00s\00.\00 \00G\00o\00t\00 \00\00\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $82 (i32.const 7676) ",\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\16\00\00\00,\00 \00c\00o\00n\00t\00e\00x\00t\00:\00 \00\00\00\00\00\00\00")
 (data $83 (i32.const 7724) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\02\00\00\00.\00\00\00\00\00\00\00\00\00\00\00")
 (data $84 (i32.const 7756) ",\00\00\00\03\00\00\00\00\00\00\00\t\00\00\00\14\00\00\00\a0\1d\00\00\00\00\00\00\10\1e\00\00\00\00\00\00@\1e\00\00\00\00\00\00\00\00\00\00")
 (data $85 (i32.const 7804) "|\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00`\00\00\00~\00l\00i\00b\00/\00@\00b\00t\00c\00-\00v\00i\00s\00i\00o\00n\00/\00b\00t\00c\00-\00r\00u\00n\00t\00i\00m\00e\00/\00r\00u\00n\00t\00i\00m\00e\00/\00m\00a\00t\00h\00/\00a\00b\00i\00.\00t\00s\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $86 (i32.const 7932) "\1c\00\00\00\00\00\00\00\00\00\00\00\01\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $87 (i32.const 7964) "\1c\00\00\00\00\00\00\00\00\00\00\00\01\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $88 (i32.const 7996) "<\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00 \00\00\00D\00i\00v\00i\00s\00i\00o\00n\00 \00b\00y\00 \00z\00e\00r\00o\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $89 (i32.const 8060) "\\\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00B\00\00\00S\00a\00f\00e\00M\00a\00t\00h\00:\00 \00m\00u\00l\00t\00i\00p\00l\00i\00c\00a\00t\00i\00o\00n\00 \00o\00v\00e\00r\00f\00l\00o\00w\00\00\00\00\00\00\00\00\00\00\00")
 (data $90 (i32.const 8156) "|\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00l\00\00\00~\00l\00i\00b\00/\00@\00b\00t\00c\00-\00v\00i\00s\00i\00o\00n\00/\00b\00t\00c\00-\00r\00u\00n\00t\00i\00m\00e\00/\00r\00u\00n\00t\00i\00m\00e\00/\00t\00y\00p\00e\00s\00/\00S\00a\00f\00e\00M\00a\00t\00h\00.\00t\00s\00")
 (data $91 (i32.const 8284) ",\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\1a\00\00\00S\00t\00o\00r\00e\00d\00A\00d\00d\00r\00e\00s\00s\00\00\00")
 (data $92 (i32.const 8332) "\1c\00\00\00\00\00\00\00\00\00\00\00\01\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $93 (i32.const 8364) "\1c\00\00\00\00\00\00\00\00\00\00\003\00\00\00\08\00\00\00\01\00\00\00\00\00\00\00\00\00\00\00")
 (data $94 (i32.const 8396) "<\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00(\00\00\00C\00o\00n\00t\00r\00a\00c\00t\00 \00i\00s\00 \00r\00e\00q\00u\00i\00r\00e\00d\00\00\00\00\00")
 (data $95 (i32.const 8460) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\08\00\00\00 \00a\00t\00 \00\00\00\00\00")
 (data $96 (i32.const 8492) ",\00\00\00\03\00\00\00\00\00\00\00\t\00\00\00\1c\00\00\00\00\00\00\00 !\00\00\00\00\00\00\80\00\00\00\00\00\00\00\80\00\00\00\00\00\00\00")
 (data $97 (i32.const 8540) "<\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00$\00\00\00U\00n\00p\00a\00i\00r\00e\00d\00 \00s\00u\00r\00r\00o\00g\00a\00t\00e\00\00\00\00\00\00\00\00\00")
 (data $98 (i32.const 8604) ",\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\1c\00\00\00~\00l\00i\00b\00/\00s\00t\00r\00i\00n\00g\00.\00t\00s\00")
 (data $99 (i32.const 8652) "<\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00 \00\00\00~\00l\00i\00b\00/\00d\00a\00t\00a\00v\00i\00e\00w\00.\00t\00s\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $100 (i32.const 8716) "\8c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00z\00\00\00A\00t\00t\00e\00m\00p\00t\00 \00t\00o\00 \00r\00e\00a\00d\00 \00b\00e\00y\00o\00n\00d\00 \00b\00u\00f\00f\00e\00r\00 \00l\00e\00n\00g\00t\00h\00.\00 \00R\00e\00q\00u\00e\00s\00t\00e\00d\00 \00u\00p\00 \00t\00o\00 \00o\00f\00f\00s\00e\00t\00 \00\00\00")
 (data $101 (i32.const 8860) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\04\00\00\00,\00 \00\00\00\00\00\00\00\00\00")
 (data $102 (i32.const 8892) "\1c\00\00\00\03\00\00\00\00\00\00\00\t\00\00\00\0c\00\00\00 \"\00\00\00\00\00\00\b0\"\00\00")
 (data $103 (i32.const 8924) "<\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00&\00\00\00b\00u\00t\00 \00b\00u\00f\00f\00e\00r\00 \00i\00s\00 \00o\00n\00l\00y\00 \00\00\00\00\00\00\00")
 (data $104 (i32.const 8988) ",\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\0e\00\00\00 \00b\00y\00t\00e\00s\00.\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $105 (i32.const 9036) "\1c\00\00\00\03\00\00\00\00\00\00\00\t\00\00\00\0c\00\00\00\f0\"\00\00\00\00\00\000#\00\00")
 (data $106 (i32.const 9068) "\8c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00t\00\00\00~\00l\00i\00b\00/\00@\00b\00t\00c\00-\00v\00i\00s\00i\00o\00n\00/\00b\00t\00c\00-\00r\00u\00n\00t\00i\00m\00e\00/\00r\00u\00n\00t\00i\00m\00e\00/\00b\00u\00f\00f\00e\00r\00/\00B\00y\00t\00e\00s\00R\00e\00a\00d\00e\00r\00.\00t\00s\00\00\00\00\00\00\00\00\00")
 (data $107 (i32.const 9212) "\1c\00\00\00\00\00\00\00\00\00\00\00\01\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $108 (i32.const 9244) "L\00\00\00\00\00\00\00\00\00\00\00\02\00\00\006\00\00\00C\00a\00n\00n\00o\00t\00 \00m\00o\00d\00i\00f\00y\00 \00a\00d\00d\00r\00e\00s\00s\00 \00d\00a\00t\00a\00.\00\00\00\00\00\00\00")
 (data $109 (i32.const 9324) "<\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00(\00\00\00C\00h\00a\00i\00n\00 \00i\00d\00 \00i\00s\00 \00r\00e\00q\00u\00i\00r\00e\00d\00\00\00\00\00")
 (data $110 (i32.const 9388) "|\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00^\00\00\00U\00n\00e\00x\00p\00e\00c\00t\00e\00d\00 \00\'\00n\00u\00l\00l\00\'\00 \00(\00n\00o\00t\00 \00a\00s\00s\00i\00g\00n\00e\00d\00 \00o\00r\00 \00f\00a\00i\00l\00e\00d\00 \00c\00a\00s\00t\00)\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $111 (i32.const 9516) "L\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00.\00\00\00I\00n\00v\00a\00l\00i\00d\00 \00c\00h\00a\00i\00n\00 \00i\00d\00 \00l\00e\00n\00g\00t\00h\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $112 (i32.const 9596) "\8c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00n\00\00\00~\00l\00i\00b\00/\00@\00b\00t\00c\00-\00v\00i\00s\00i\00o\00n\00/\00b\00t\00c\00-\00r\00u\00n\00t\00i\00m\00e\00/\00r\00u\00n\00t\00i\00m\00e\00/\00s\00c\00r\00i\00p\00t\00/\00N\00e\00t\00w\00o\00r\00k\00s\00.\00t\00s\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $113 (i32.const 9740) "<\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00 \00\00\00U\00n\00k\00n\00o\00w\00n\00 \00c\00h\00a\00i\00n\00 \00i\00d\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $114 (i32.const 9804) "|\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00^\00\00\00E\00l\00e\00m\00e\00n\00t\00 \00t\00y\00p\00e\00 \00m\00u\00s\00t\00 \00b\00e\00 \00n\00u\00l\00l\00a\00b\00l\00e\00 \00i\00f\00 \00a\00r\00r\00a\00y\00 \00i\00s\00 \00h\00o\00l\00e\00y\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $115 (i32.const 9932) ",\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\14\00\00\00d\00e\00p\00l\00o\00y\00e\00r\00(\00)\00\00\00\00\00\00\00\00\00")
 (data $116 (i32.const 9980) "l\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00T\00\00\00b\00y\00t\00e\00s\00T\00o\00U\003\002\00:\00 \00i\00n\00p\00u\00t\00 \00m\00u\00s\00t\00 \00b\00e\00 \00a\00t\00 \00l\00e\00a\00s\00t\00 \004\00 \00b\00y\00t\00e\00s\00\00\00\00\00\00\00\00\00")
 (data $117 (i32.const 10092) "|\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00d\00\00\00~\00l\00i\00b\00/\00@\00b\00t\00c\00-\00v\00i\00s\00i\00o\00n\00/\00b\00t\00c\00-\00r\00u\00n\00t\00i\00m\00e\00/\00r\00u\00n\00t\00i\00m\00e\00/\00m\00a\00t\00h\00/\00b\00y\00t\00e\00s\00.\00t\00s\00\00\00\00\00\00\00\00\00")
 (data $118 (i32.const 10220) "<\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00(\00\00\00D\00e\00p\00l\00o\00y\00e\00r\00 \00i\00s\00 \00r\00e\00q\00u\00i\00r\00e\00d\00\00\00\00\00")
 (data $119 (i32.const 10284) "<\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00(\00\00\00A\00d\00d\00r\00e\00s\00s\00 \00i\00s\00 \00t\00o\00o\00 \00l\00o\00n\00g\00 \00\00\00\00\00")
 (data $120 (i32.const 10348) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\06\00\00\00 \00>\00 \00\00\00\00\00\00\00")
 (data $121 (i32.const 10380) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\0c\00\00\00 \00b\00y\00t\00e\00s\00")
 (data $122 (i32.const 10412) ",\00\00\00\03\00\00\00\00\00\00\00\t\00\00\00\14\00\00\00@(\00\00\00\00\00\00\80(\00\00\00\00\00\00\a0(\00\00\00\00\00\00\00\00\00\00")
 (data $123 (i32.const 10460) "\8c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00t\00\00\00~\00l\00i\00b\00/\00@\00b\00t\00c\00-\00v\00i\00s\00i\00o\00n\00/\00b\00t\00c\00-\00r\00u\00n\00t\00i\00m\00e\00/\00r\00u\00n\00t\00i\00m\00e\00/\00b\00u\00f\00f\00e\00r\00/\00B\00y\00t\00e\00s\00W\00r\00i\00t\00e\00r\00.\00t\00s\00\00\00\00\00\00\00\00\00")
 (data $124 (i32.const 10604) "L\00\00\00\00\00\00\00\00\00\00\00\02\00\00\008\00\00\00B\00y\00t\00e\00s\00W\00r\00i\00t\00e\00r\00:\00 \00o\00f\00f\00s\00e\00t\00 \00o\00v\00e\00r\00f\00l\00o\00w\00\00\00\00\00")
 (data $125 (i32.const 10684) "\8c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00p\00\00\00B\00u\00f\00f\00e\00r\00 \00i\00s\00 \00g\00e\00t\00t\00i\00n\00g\00 \00r\00e\00s\00i\00z\00e\00d\00.\00 \00T\00h\00i\00s\00 \00i\00s\00 \00b\00a\00d\00 \00f\00o\00r\00 \00p\00e\00r\00f\00o\00r\00m\00a\00n\00c\00e\00.\00 \00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $126 (i32.const 10828) "<\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\1e\00\00\00E\00x\00p\00e\00c\00t\00e\00d\00 \00s\00i\00z\00e\00:\00 \00\00\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $127 (i32.const 10892) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\06\00\00\00 \00-\00 \00\00\00\00\00\00\00")
 (data $128 (i32.const 10924) "\1c\00\00\00\03\00\00\00\00\00\00\00\t\00\00\00\0c\00\00\00`*\00\00\00\00\00\00\a0*\00\00")
 (data $129 (i32.const 10956) ",\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\1c\00\00\00C\00u\00r\00r\00e\00n\00t\00 \00s\00i\00z\00e\00:\00 \00")
 (data $130 (i32.const 11004) "<\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00$\00\00\00M\00e\00t\00h\00o\00d\00 \00n\00o\00t\00 \00f\00o\00u\00n\00d\00:\00 \00\00\00\00\00\00\00\00\00")
 (data $131 (i32.const 11068) "\8c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00p\00\00\00~\00l\00i\00b\00/\00@\00b\00t\00c\00-\00v\00i\00s\00i\00o\00n\00/\00b\00t\00c\00-\00r\00u\00n\00t\00i\00m\00e\00/\00r\00u\00n\00t\00i\00m\00e\00/\00c\00o\00n\00t\00r\00a\00c\00t\00s\00/\00O\00P\00_\00N\00E\00T\00.\00t\00s\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $132 (i32.const 11212) "L\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00:\00\00\00P\00o\00i\00n\00t\00e\00r\00 \00m\00u\00s\00t\00 \00b\00e\00 \003\002\00 \00b\00y\00t\00e\00s\00 \00l\00o\00n\00g\00\00\00")
 (data $133 (i32.const 11292) "\\\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00B\00\00\00K\00e\00y\00 \00n\00o\00t\00 \00f\00o\00u\00n\00d\00 \00i\00n\00 \00m\00a\00p\00 \00(\00u\00i\00n\00t\008\00a\00r\00r\00a\00y\00)\00\00\00\00\00\00\00\00\00\00\00")
 (data $134 (i32.const 11388) "\8c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00z\00\00\00~\00l\00i\00b\00/\00@\00b\00t\00c\00-\00v\00i\00s\00i\00o\00n\00/\00b\00t\00c\00-\00r\00u\00n\00t\00i\00m\00e\00/\00r\00u\00n\00t\00i\00m\00e\00/\00g\00e\00n\00e\00r\00i\00c\00/\00M\00a\00p\00U\00i\00n\00t\008\00A\00r\00r\00a\00y\00.\00t\00s\00\00\00")
 (data $135 (i32.const 11532) "L\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00.\00\00\00R\00e\00e\00n\00t\00r\00a\00n\00c\00y\00G\00u\00a\00r\00d\00:\00 \00L\00O\00C\00K\00E\00D\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $136 (i32.const 11612) "\9c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\82\00\00\00~\00l\00i\00b\00/\00@\00b\00t\00c\00-\00v\00i\00s\00i\00o\00n\00/\00b\00t\00c\00-\00r\00u\00n\00t\00i\00m\00e\00/\00r\00u\00n\00t\00i\00m\00e\00/\00c\00o\00n\00t\00r\00a\00c\00t\00s\00/\00R\00e\00e\00n\00t\00r\00a\00n\00c\00y\00G\00u\00a\00r\00d\00.\00t\00s\00\00\00\00\00\00\00\00\00\00\00")
 (data $137 (i32.const 11772) "\\\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00F\00\00\00R\00e\00e\00n\00t\00r\00a\00n\00c\00y\00G\00u\00a\00r\00d\00:\00 \00M\00a\00x\00 \00d\00e\00p\00t\00h\00 \00e\00x\00c\00e\00e\00d\00e\00d\00\00\00\00\00\00\00")
 (data $138 (i32.const 11868) "L\00\00\00\00\00\00\00\00\00\00\00\02\00\00\006\00\00\00S\00a\00f\00e\00M\00a\00t\00h\00:\00 \00a\00d\00d\00i\00t\00i\00o\00n\00 \00o\00v\00e\00r\00f\00l\00o\00w\00\00\00\00\00\00\00")
 (data $139 (i32.const 11948) "L\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00.\00\00\00T\00r\00a\00n\00s\00a\00c\00t\00i\00o\00n\00 \00i\00s\00 \00r\00e\00q\00u\00i\00r\00e\00d\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $140 (i32.const 12028) "<\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00(\00\00\00N\00o\00t\00 \00b\00r\00i\00d\00g\00e\00 \00a\00u\00t\00h\00o\00r\00i\00t\00y\00\00\00\00\00")
 (data $141 (i32.const 12092) "L\00\00\00\00\00\00\00\00\00\00\00\02\00\00\004\00\00\00s\00r\00c\00/\00w\00r\00a\00p\00p\00e\00d\00/\00h\00u\00s\00d\00t\00/\00H\00U\00S\00D\00T\00.\00t\00s\00\00\00\00\00\00\00\00\00")
 (data $142 (i32.const 12172) "<\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\"\00\00\00I\00n\00v\00a\00l\00i\00d\00 \00r\00e\00c\00i\00p\00i\00e\00n\00t\00\00\00\00\00\00\00\00\00\00\00")
 (data $143 (i32.const 12236) ",\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\1c\00\00\00A\00m\00o\00u\00n\00t\00 \00i\00s\00 \00z\00e\00r\00o\00")
 (data $144 (i32.const 12284) "<\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00 \00\00\00I\00n\00v\00a\00l\00i\00d\00 \00r\00e\00c\00e\00i\00v\00e\00r\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $145 (i32.const 12348) "|\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00l\00\00\00~\00l\00i\00b\00/\00@\00b\00t\00c\00-\00v\00i\00s\00i\00o\00n\00/\00b\00t\00c\00-\00r\00u\00n\00t\00i\00m\00e\00/\00r\00u\00n\00t\00i\00m\00e\00/\00c\00o\00n\00t\00r\00a\00c\00t\00s\00/\00O\00P\002\000\00.\00t\00s\00")
 (data $146 (i32.const 12476) "<\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00 \00\00\00A\00d\00d\00r\00e\00s\00s\00M\00e\00m\00o\00r\00y\00M\00a\00p\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $147 (i32.const 12540) "<\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00$\00\00\00M\00a\00x\00 \00s\00u\00p\00p\00l\00y\00 \00r\00e\00a\00c\00h\00e\00d\00\00\00\00\00\00\00\00\00")
 (data $148 (i32.const 12604) "l\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00R\00\00\00E\00v\00e\00n\00t\00 \00d\00a\00t\00a\00 \00l\00e\00n\00g\00t\00h\00 \00e\00x\00c\00e\00e\00d\00s\00 \00m\00a\00x\00i\00m\00u\00m\00 \00l\00e\00n\00g\00t\00h\00.\00\00\00\00\00\00\00\00\00\00\00")
 (data $149 (i32.const 12716) "\8c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00n\00\00\00~\00l\00i\00b\00/\00@\00b\00t\00c\00-\00v\00i\00s\00i\00o\00n\00/\00b\00t\00c\00-\00r\00u\00n\00t\00i\00m\00e\00/\00r\00u\00n\00t\00i\00m\00e\00/\00e\00v\00e\00n\00t\00s\00/\00N\00e\00t\00E\00v\00e\00n\00t\00.\00t\00s\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $150 (i32.const 12860) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\0c\00\00\00M\00i\00n\00t\00e\00d\00")
 (data $151 (i32.const 12892) "<\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00*\00\00\00B\00u\00f\00f\00e\00r\00 \00i\00s\00 \00n\00o\00t\00 \00d\00e\00f\00i\00n\00e\00d\00\00\00")
 (data $152 (i32.const 12956) ",\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\18\00\00\00B\00r\00i\00d\00g\00e\00M\00i\00n\00t\00e\00d\00\00\00\00\00")
 (data $153 (i32.const 13004) "<\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00(\00\00\00I\00n\00v\00a\00l\00i\00d\00 \00b\00u\00r\00n\00 \00a\00c\00c\00o\00u\00n\00t\00\00\00\00\00")
 (data $154 (i32.const 13068) "<\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00(\00\00\00I\00n\00s\00u\00f\00f\00i\00c\00i\00e\00n\00t\00 \00b\00a\00l\00a\00n\00c\00e\00\00\00\00\00")
 (data $155 (i32.const 13132) ",\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\1c\00\00\00I\00n\00v\00a\00l\00i\00d\00 \00s\00e\00n\00d\00e\00r\00")
 (data $156 (i32.const 13180) "\\\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00>\00\00\00S\00a\00f\00e\00M\00a\00t\00h\00:\00 \00s\00u\00b\00t\00r\00a\00c\00t\00i\00o\00n\00 \00u\00n\00d\00e\00r\00f\00l\00o\00w\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $157 (i32.const 13276) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\0c\00\00\00B\00u\00r\00n\00e\00d\00")
 (data $158 (i32.const 13308) ",\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\18\00\00\00B\00r\00i\00d\00g\00e\00B\00u\00r\00n\00e\00d\00\00\00\00\00")
 (data $159 (i32.const 13356) "L\00\00\00\00\00\00\00\00\00\00\00\02\00\00\000\00\00\00I\00n\00v\00a\00l\00i\00d\00 \00b\00r\00i\00d\00g\00e\00 \00a\00u\00t\00h\00o\00r\00i\00t\00y\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $160 (i32.const 13436) "<\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00,\00\00\00B\00r\00i\00d\00g\00e\00A\00u\00t\00h\00o\00r\00i\00t\00y\00C\00h\00a\00n\00g\00e\00d\00")
 (data $161 (i32.const 13500) "\\\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00F\00\00\00b\00i\00g\00E\00n\00d\00i\00a\00n\00A\00d\00d\00:\00 \00b\00a\00s\00e\00 \00m\00u\00s\00t\00 \00b\00e\00 \003\002\00 \00b\00y\00t\00e\00s\00\00\00\00\00\00\00")
 (data $162 (i32.const 13596) "l\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00N\00\00\00a\00d\00d\00U\00i\00n\00t\008\00A\00r\00r\00a\00y\00s\00B\00E\00 \00e\00x\00p\00e\00c\00t\00s\00 \003\002\00-\00b\00y\00t\00e\00 \00i\00n\00p\00u\00t\00s\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $163 (i32.const 13708) "L\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00.\00\00\00P\00r\00o\00t\00o\00c\00o\00l\00 \00i\00d\00 \00i\00s\00 \00r\00e\00q\00u\00i\00r\00e\00d\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $164 (i32.const 13788) "L\00\00\00\00\00\00\00\00\00\00\00\02\00\00\008\00\00\00C\00o\00n\00t\00r\00a\00c\00t\00 \00a\00d\00d\00r\00e\00s\00s\00 \00i\00s\00 \00r\00e\00q\00u\00i\00r\00e\00d\00\00\00\00\00")
 (data $165 (i32.const 13868) "L\00\00\00\00\00\00\00\00\00\00\00\02\00\00\004\00\00\00K\00e\00y\00 \00n\00o\00t\00 \00f\00o\00u\00n\00d\00 \00i\00n\00 \00m\00a\00p\00 \00(\00M\00a\00p\00)\00\00\00\00\00\00\00\00\00")
 (data $166 (i32.const 13948) "|\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00f\00\00\00~\00l\00i\00b\00/\00@\00b\00t\00c\00-\00v\00i\00s\00i\00o\00n\00/\00b\00t\00c\00-\00r\00u\00n\00t\00i\00m\00e\00/\00r\00u\00n\00t\00i\00m\00e\00/\00g\00e\00n\00e\00r\00i\00c\00/\00M\00a\00p\00.\00t\00s\00\00\00\00\00\00\00")
 (data $167 (i32.const 14076) ",\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\16\00\00\00T\00r\00a\00n\00s\00f\00e\00r\00r\00e\00d\00\00\00\00\00\00\00")
 (data $168 (i32.const 14124) "<\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00,\00\00\00I\00n\00s\00u\00f\00f\00i\00c\00i\00e\00n\00t\00 \00a\00l\00l\00o\00w\00a\00n\00c\00e\00")
 (data $169 (i32.const 14188) "<\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00 \00\00\00i\00n\00v\00a\00l\00i\00d\00 \00d\00o\00w\00n\00c\00a\00s\00t\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $170 (i32.const 14252) "\8c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00n\00\00\00~\00l\00i\00b\00/\00@\00b\00t\00c\00-\00v\00i\00s\00i\00o\00n\00/\00b\00t\00c\00-\00r\00u\00n\00t\00i\00m\00e\00/\00r\00u\00n\00t\00i\00m\00e\00/\00m\00e\00m\00o\00r\00y\00/\00M\00a\00p\00O\00f\00M\00a\00p\00.\00t\00s\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $171 (i32.const 14396) "\\\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00@\00\00\00D\00e\00s\00t\00i\00n\00a\00t\00i\00o\00n\00 \00c\00o\00n\00t\00r\00a\00c\00t\00 \00i\00s\00 \00r\00e\00q\00u\00i\00r\00e\00d\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $172 (i32.const 14492) "L\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00<\00\00\00T\00r\00a\00n\00s\00f\00e\00r\00 \00r\00e\00j\00e\00c\00t\00e\00d\00 \00b\00y\00 \00r\00e\00c\00i\00p\00i\00e\00n\00t\00")
 (data $173 (i32.const 14572) "<\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00 \00\00\00I\00n\00v\00a\00l\00i\00d\00 \00a\00p\00p\00r\00o\00v\00e\00r\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $174 (i32.const 14636) "<\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\1e\00\00\00I\00n\00v\00a\00l\00i\00d\00 \00s\00p\00e\00n\00d\00e\00r\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $175 (i32.const 14700) ",\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\10\00\00\00A\00p\00p\00r\00o\00v\00e\00d\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $176 (i32.const 14748) "L\00\00\00\00\00\00\00\00\00\00\00\02\00\00\000\00\00\00I\00n\00v\00a\00l\00i\00d\00 \00s\00i\00g\00n\00a\00t\00u\00r\00e\00 \00l\00e\00n\00g\00t\00h\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $177 (i32.const 14828) "<\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\"\00\00\00B\00l\00o\00c\00k\00 \00i\00s\00 \00r\00e\00q\00u\00i\00r\00e\00d\00\00\00\00\00\00\00\00\00\00\00")
 (data $178 (i32.const 14892) "<\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\"\00\00\00S\00i\00g\00n\00a\00t\00u\00r\00e\00 \00e\00x\00p\00i\00r\00e\00d\00\00\00\00\00\00\00\00\00\00\00")
 (data $179 (i32.const 14956) "L\00\00\00\00\00\00\00\00\00\00\00\02\00\00\002\00\00\00I\00n\00v\00a\00l\00i\00d\00 \00s\00i\00g\00n\00a\00t\00u\00r\00e\00 \00l\00e\00n\00g\00t\00h\00.\00\00\00\00\00\00\00\00\00\00\00")
 (data $180 (i32.const 15036) "<\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00(\00\00\00I\00n\00v\00a\00l\00i\00d\00 \00h\00a\00s\00h\00 \00l\00e\00n\00g\00t\00h\00.\00\00\00\00\00")
 (data $181 (i32.const 15100) "\0c\01\00\00\00\00\00\00\00\00\00\00\02\00\00\00\fc\00\00\00E\00C\00D\00S\00A\00 \00v\00e\00r\00i\00f\00i\00c\00a\00t\00i\00o\00n\00 \00i\00s\00 \00n\00o\00t\00 \00s\00u\00p\00p\00o\00r\00t\00e\00d\00 \00b\00y\00 \00v\00e\00r\00i\00f\00y\00S\00i\00g\00n\00a\00t\00u\00r\00e\00(\00)\00.\00 \00U\00s\00e\00 \00v\00e\00r\00i\00f\00y\00E\00C\00D\00S\00A\00S\00i\00g\00n\00a\00t\00u\00r\00e\00(\00)\00 \00o\00r\00 \00v\00e\00r\00i\00f\00y\00B\00i\00t\00c\00o\00i\00n\00E\00C\00D\00S\00A\00S\00i\00g\00n\00a\00t\00u\00r\00e\00(\00)\00 \00i\00n\00s\00t\00e\00a\00d\00.\00")
 (data $182 (i32.const 15372) "L\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00:\00\00\00I\00n\00v\00a\00l\00i\00d\00 \00M\00L\00-\00D\00S\00A\00 \00s\00e\00c\00u\00r\00i\00t\00y\00 \00l\00e\00v\00e\00l\00\00\00")
 (data $183 (i32.const 15452) "\9c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\86\00\00\00~\00l\00i\00b\00/\00@\00b\00t\00c\00-\00v\00i\00s\00i\00o\00n\00/\00b\00t\00c\00-\00r\00u\00n\00t\00i\00m\00e\00/\00r\00u\00n\00t\00i\00m\00e\00/\00e\00n\00v\00/\00c\00o\00n\00s\00e\00n\00s\00u\00s\00/\00M\00L\00D\00S\00A\00M\00e\00t\00a\00d\00a\00t\00a\00.\00t\00s\00\00\00\00\00\00\00")
 (data $184 (i32.const 15612) "L\00\00\00\00\00\00\00\00\00\00\00\02\00\00\006\00\00\00M\00L\00-\00D\00S\00A\00 \00p\00u\00b\00l\00i\00c\00 \00k\00e\00y\00 \00n\00o\00t\00 \00f\00o\00u\00n\00d\00\00\00\00\00\00\00")
 (data $185 (i32.const 15692) "|\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00d\00\00\00~\00l\00i\00b\00/\00@\00b\00t\00c\00-\00v\00i\00s\00i\00o\00n\00/\00b\00t\00c\00-\00r\00u\00n\00t\00i\00m\00e\00/\00r\00u\00n\00t\00i\00m\00e\00/\00e\00n\00v\00/\00g\00l\00o\00b\00a\00l\00.\00t\00s\00\00\00\00\00\00\00\00\00")
 (data $186 (i32.const 15820) "\\\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00B\00\00\00I\00n\00v\00a\00l\00i\00d\00 \00M\00L\00-\00D\00S\00A\00 \00p\00u\00b\00l\00i\00c\00 \00k\00e\00y\00 \00l\00e\00n\00g\00t\00h\00.\00\00\00\00\00\00\00\00\00\00\00")
 (data $187 (i32.const 15916) "\\\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00@\00\00\00I\00n\00v\00a\00l\00i\00d\00 \00M\00L\00-\00D\00S\00A\00 \00s\00i\00g\00n\00a\00t\00u\00r\00e\00 \00l\00e\00n\00g\00t\00h\00.\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $188 (i32.const 16012) "\bc\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\aa\00\00\00I\00n\00v\00a\00l\00i\00d\00 \00s\00i\00g\00n\00a\00t\00u\00r\00e\00 \00t\00y\00p\00e\00 \00o\00r\00 \00s\00i\00g\00n\00a\00t\00u\00r\00e\00s\00 \00s\00c\00h\00e\00m\00a\00 \00n\00o\00t\00 \00a\00l\00l\00o\00w\00e\00d\00 \00u\00n\00d\00e\00r\00 \00c\00u\00r\00r\00e\00n\00t\00 \00c\00o\00n\00s\00e\00n\00s\00u\00s\00 \00r\00u\00l\00e\00s\00\00\00")
 (data $189 (i32.const 16204) "<\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\"\00\00\00I\00n\00v\00a\00l\00i\00d\00 \00s\00i\00g\00n\00a\00t\00u\00r\00e\00\00\00\00\00\00\00\00\00\00\00")
 (data $190 (i32.const 16268) "\\\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00@\00\00\00R\00e\00e\00n\00t\00r\00a\00n\00c\00y\00G\00u\00a\00r\00d\00:\00 \00D\00e\00p\00t\00h\00 \00u\00n\00d\00e\00r\00f\00l\00o\00w\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $191 (i32.const 16364) "<\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00&\00\00\00h\00e\00p\00t\00a\00d\00-\00b\00r\00i\00d\00g\00e\00d\00 \00U\00S\00D\00T\00\00\00\00\00\00\00")
 (data $192 (i32.const 16428) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\n\00\00\00h\00U\00S\00D\00T\00\00\00")
 (data $193 (i32.const 16460) "<\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00&\00\00\00A\00l\00r\00e\00a\00d\00y\00 \00i\00n\00i\00t\00i\00a\00l\00i\00z\00e\00d\00\00\00\00\00\00\00")
 (data $194 (i32.const 16524) "\\\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00D\00\00\00O\00n\00l\00y\00 \00d\00e\00p\00l\00o\00y\00e\00r\00 \00c\00a\00n\00 \00c\00a\00l\00l\00 \00t\00h\00i\00s\00 \00m\00e\00t\00h\00o\00d\00\00\00\00\00\00\00\00\00")
 (data $195 (i32.const 16620) ",\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\1a\00\00\00D\00e\00c\00i\00m\00a\00l\00s\00 \00>\00 \003\002\00\00\00")
 (data $196 (i32.const 16668) "L\00\00\00\00\00\00\00\00\00\00\00\02\00\00\002\00\00\00:\00 \00v\00a\00l\00u\00e\00 \00i\00s\00 \00t\00o\00o\00 \00l\00o\00n\00g\00 \00(\00m\00a\00x\00=\00\00\00\00\00\00\00\00\00\00\00")
 (data $197 (i32.const 16748) ",\00\00\00\03\00\00\00\00\00\00\00\t\00\00\00\10\00\00\00\00\00\00\000A\00\00\00\00\00\000\0b\00\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $198 (i32.const 16796) "\9c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\80\00\00\00~\00l\00i\00b\00/\00@\00b\00t\00c\00-\00v\00i\00s\00i\00o\00n\00/\00b\00t\00c\00-\00r\00u\00n\00t\00i\00m\00e\00/\00r\00u\00n\00t\00i\00m\00e\00/\00s\00t\00o\00r\00a\00g\00e\00/\00B\00a\00s\00e\00S\00t\00o\00r\00e\00d\00S\00t\00r\00i\00n\00g\00.\00t\00s\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $199 (i32.const 16956) ",\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\18\00\00\00S\00t\00o\00r\00e\00d\00S\00t\00r\00i\00n\00g\00\00\00\00\00")
 (data $200 (i32.const 17008) "A\00\00\00 \00\00\00 \00\00\00 \00\00\00\00\00\00\00 \00\00\00d\00\00\00A\00\00\00A\00\00\00B\00\00\00\04A\00\00\02\t\00\00\00\00\00\00A\00\00\00A\08\00\00A\00\00\00\00\00\00\00\00\00\00\00 \00\00\00\02A\00\00\00\00\00\00 \00\00\00 \00\00\00\02A\00\00\00\00\00\00 \00\00\00\00\00\00\00 \00\00\00 \00\00\00\00\00\00\00\02A\00\00\00\00\00\00\02A\00\00 \00\00\00\02\01\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00 \00\00\00\00\00\00\00\00\00\00\00\00\00\00\00 \00\00\00\02A\00\00\02A\00\00 \00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\02\02\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (table $0 2 2 funcref)
 (elem $0 (i32.const 1) $start:src/wrapped/husdt/index~anonymous|0)
 (export "abort" (func $src/wrapped/husdt/index/abort))
 (export "execute" (func $~lib/@btc-vision/btc-runtime/runtime/exports/index/execute))
 (export "onDeploy" (func $~lib/@btc-vision/btc-runtime/runtime/exports/index/onDeploy))
 (export "onUpdate" (func $~lib/@btc-vision/btc-runtime/runtime/exports/index/onUpdate))
 (export "__new" (func $~lib/rt/stub/__new))
 (export "__pin" (func $~lib/rt/stub/__pin))
 (export "__unpin" (func $~lib/rt/stub/__unpin))
 (export "__collect" (func $~lib/rt/stub/__collect))
 (export "__rtti_base" (global $~lib/rt/__rtti_base))
 (export "memory" (memory $0))
 (start $~start)
 (func $~lib/rt/common/OBJECT#get:rtSize (param $0 i32) (result i32)
  local.get $0
  i32.load offset=16
 )
 (func $~lib/string/String#get:length (param $0 i32) (result i32)
  local.get $0
  i32.const 20
  i32.sub
  call $~lib/rt/common/OBJECT#get:rtSize
  i32.const 1
  i32.shr_u
  return
 )
 (func $~lib/string/String#concat (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  local.get $0
  call $~lib/string/String#get:length
  i32.const 1
  i32.shl
  local.set $2
  local.get $1
  call $~lib/string/String#get:length
  i32.const 1
  i32.shl
  local.set $3
  local.get $2
  local.get $3
  i32.add
  local.set $4
  local.get $4
  i32.const 0
  i32.eq
  if
   i32.const 96
   return
  end
  local.get $4
  i32.const 2
  call $~lib/rt/stub/__new
  local.set $5
  local.get $5
  local.get $0
  local.get $2
  memory.copy
  local.get $5
  local.get $2
  i32.add
  local.get $1
  local.get $3
  memory.copy
  local.get $5
  return
 )
 (func $~lib/string/String.__concat (param $0 i32) (param $1 i32) (result i32)
  local.get $0
  local.get $1
  call $~lib/string/String#concat
  return
 )
 (func $~lib/util/number/decimalCount32 (param $0 i32) (result i32)
  local.get $0
  i32.const 100000
  i32.lt_u
  if
   local.get $0
   i32.const 100
   i32.lt_u
   if
    i32.const 1
    local.get $0
    i32.const 10
    i32.ge_u
    i32.add
    return
   else
    i32.const 3
    local.get $0
    i32.const 10000
    i32.ge_u
    i32.add
    local.get $0
    i32.const 1000
    i32.ge_u
    i32.add
    return
   end
   unreachable
  else
   local.get $0
   i32.const 10000000
   i32.lt_u
   if
    i32.const 6
    local.get $0
    i32.const 1000000
    i32.ge_u
    i32.add
    return
   else
    i32.const 8
    local.get $0
    i32.const 1000000000
    i32.ge_u
    i32.add
    local.get $0
    i32.const 100000000
    i32.ge_u
    i32.add
    return
   end
   unreachable
  end
  unreachable
 )
 (func $~lib/util/number/utoa32_dec_lut (param $0 i32) (param $1 i32) (param $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i64)
  (local $8 i64)
  (local $9 i32)
  (local $10 i32)
  (local $11 i32)
  (local $12 i32)
  (local $13 i32)
  loop $while-continue|0
   local.get $1
   i32.const 10000
   i32.ge_u
   if
    local.get $1
    i32.const 10000
    i32.div_u
    local.set $3
    local.get $1
    i32.const 10000
    i32.rem_u
    local.set $4
    local.get $3
    local.set $1
    local.get $4
    i32.const 100
    i32.div_u
    local.set $5
    local.get $4
    i32.const 100
    i32.rem_u
    local.set $6
    i32.const 364
    local.get $5
    i32.const 2
    i32.shl
    i32.add
    i64.load32_u
    local.set $7
    i32.const 364
    local.get $6
    i32.const 2
    i32.shl
    i32.add
    i64.load32_u
    local.set $8
    local.get $2
    i32.const 4
    i32.sub
    local.set $2
    local.get $0
    local.get $2
    i32.const 1
    i32.shl
    i32.add
    local.get $7
    local.get $8
    i64.const 32
    i64.shl
    i64.or
    i64.store
    br $while-continue|0
   end
  end
  local.get $1
  i32.const 100
  i32.ge_u
  if
   local.get $1
   i32.const 100
   i32.div_u
   local.set $9
   local.get $1
   i32.const 100
   i32.rem_u
   local.set $10
   local.get $9
   local.set $1
   local.get $2
   i32.const 2
   i32.sub
   local.set $2
   i32.const 364
   local.get $10
   i32.const 2
   i32.shl
   i32.add
   i32.load
   local.set $11
   local.get $0
   local.get $2
   i32.const 1
   i32.shl
   i32.add
   local.get $11
   i32.store
  end
  local.get $1
  i32.const 10
  i32.ge_u
  if
   local.get $2
   i32.const 2
   i32.sub
   local.set $2
   i32.const 364
   local.get $1
   i32.const 2
   i32.shl
   i32.add
   i32.load
   local.set $12
   local.get $0
   local.get $2
   i32.const 1
   i32.shl
   i32.add
   local.get $12
   i32.store
  else
   local.get $2
   i32.const 1
   i32.sub
   local.set $2
   i32.const 48
   local.get $1
   i32.add
   local.set $13
   local.get $0
   local.get $2
   i32.const 1
   i32.shl
   i32.add
   local.get $13
   i32.store16
  end
 )
 (func $~lib/util/number/utoa_hex_lut (param $0 i32) (param $1 i64) (param $2 i32)
  loop $while-continue|0
   local.get $2
   i32.const 2
   i32.ge_u
   if
    local.get $2
    i32.const 2
    i32.sub
    local.set $2
    local.get $0
    local.get $2
    i32.const 1
    i32.shl
    i32.add
    i32.const 784
    local.get $1
    i32.wrap_i64
    i32.const 255
    i32.and
    i32.const 2
    i32.shl
    i32.add
    i32.load
    i32.store
    local.get $1
    i64.const 8
    i64.shr_u
    local.set $1
    br $while-continue|0
   end
  end
  local.get $2
  i32.const 1
  i32.and
  if
   local.get $0
   i32.const 784
   local.get $1
   i32.wrap_i64
   i32.const 6
   i32.shl
   i32.add
   i32.load16_u
   i32.store16
  end
 )
 (func $~lib/util/number/ulog_base (param $0 i64) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i64)
  (local $4 i64)
  (local $5 i32)
  block $~lib/util/number/isPowerOf2<i32>|inlined.0 (result i32)
   local.get $1
   local.set $2
   local.get $2
   i32.popcnt
   i32.const 1
   i32.eq
   br $~lib/util/number/isPowerOf2<i32>|inlined.0
  end
  if
   i32.const 63
   local.get $0
   i64.clz
   i32.wrap_i64
   i32.sub
   i32.const 31
   local.get $1
   i32.clz
   i32.sub
   i32.div_u
   i32.const 1
   i32.add
   return
  end
  local.get $1
  i64.extend_i32_s
  local.set $3
  local.get $3
  local.set $4
  i32.const 1
  local.set $5
  loop $while-continue|0
   local.get $0
   local.get $4
   i64.ge_u
   if
    local.get $0
    local.get $4
    i64.div_u
    local.set $0
    local.get $4
    local.get $4
    i64.mul
    local.set $4
    local.get $5
    i32.const 1
    i32.shl
    local.set $5
    br $while-continue|0
   end
  end
  loop $while-continue|1
   local.get $0
   i64.const 1
   i64.ge_u
   if
    local.get $0
    local.get $3
    i64.div_u
    local.set $0
    local.get $5
    i32.const 1
    i32.add
    local.set $5
    br $while-continue|1
   end
  end
  local.get $5
  i32.const 1
  i32.sub
  return
 )
 (func $~lib/util/number/utoa64_any_core (param $0 i32) (param $1 i64) (param $2 i32) (param $3 i32)
  (local $4 i64)
  (local $5 i64)
  (local $6 i64)
  (local $7 i64)
  local.get $3
  i64.extend_i32_s
  local.set $4
  local.get $3
  local.get $3
  i32.const 1
  i32.sub
  i32.and
  i32.const 0
  i32.eq
  if
   local.get $3
   i32.ctz
   i32.const 7
   i32.and
   i64.extend_i32_s
   local.set $5
   local.get $4
   i64.const 1
   i64.sub
   local.set $6
   loop $do-loop|0
    local.get $2
    i32.const 1
    i32.sub
    local.set $2
    local.get $0
    local.get $2
    i32.const 1
    i32.shl
    i32.add
    i32.const 1840
    local.get $1
    local.get $6
    i64.and
    i32.wrap_i64
    i32.const 1
    i32.shl
    i32.add
    i32.load16_u
    i32.store16
    local.get $1
    local.get $5
    i64.shr_u
    local.set $1
    local.get $1
    i64.const 0
    i64.ne
    br_if $do-loop|0
   end
  else
   loop $do-loop|1
    local.get $2
    i32.const 1
    i32.sub
    local.set $2
    local.get $1
    local.get $4
    i64.div_u
    local.set $7
    local.get $0
    local.get $2
    i32.const 1
    i32.shl
    i32.add
    i32.const 1840
    local.get $1
    local.get $7
    local.get $4
    i64.mul
    i64.sub
    i32.wrap_i64
    i32.const 1
    i32.shl
    i32.add
    i32.load16_u
    i32.store16
    local.get $7
    local.set $1
    local.get $1
    i64.const 0
    i64.ne
    br_if $do-loop|1
   end
  end
 )
 (func $~lib/util/number/utoa32 (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  (local $10 i32)
  (local $11 i32)
  local.get $1
  i32.const 2
  i32.lt_s
  if (result i32)
   i32.const 1
  else
   local.get $1
   i32.const 36
   i32.gt_s
  end
  if
   i32.const 160
   i32.const 288
   i32.const 350
   i32.const 5
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  i32.eqz
  if
   i32.const 352
   return
  end
  local.get $1
  i32.const 10
  i32.eq
  if
   local.get $0
   call $~lib/util/number/decimalCount32
   local.set $3
   local.get $3
   i32.const 1
   i32.shl
   i32.const 2
   call $~lib/rt/stub/__new
   local.set $2
   local.get $2
   local.set $4
   local.get $0
   local.set $5
   local.get $3
   local.set $6
   i32.const 0
   i32.const 1
   i32.ge_s
   drop
   local.get $4
   local.get $5
   local.get $6
   call $~lib/util/number/utoa32_dec_lut
  else
   local.get $1
   i32.const 16
   i32.eq
   if
    i32.const 31
    local.get $0
    i32.clz
    i32.sub
    i32.const 2
    i32.shr_s
    i32.const 1
    i32.add
    local.set $7
    local.get $7
    i32.const 1
    i32.shl
    i32.const 2
    call $~lib/rt/stub/__new
    local.set $2
    local.get $2
    local.set $8
    local.get $0
    local.set $9
    local.get $7
    local.set $10
    i32.const 0
    i32.const 1
    i32.ge_s
    drop
    local.get $8
    local.get $9
    i64.extend_i32_u
    local.get $10
    call $~lib/util/number/utoa_hex_lut
   else
    local.get $0
    i64.extend_i32_u
    local.get $1
    call $~lib/util/number/ulog_base
    local.set $11
    local.get $11
    i32.const 1
    i32.shl
    i32.const 2
    call $~lib/rt/stub/__new
    local.set $2
    local.get $2
    local.get $0
    i64.extend_i32_u
    local.get $11
    local.get $1
    call $~lib/util/number/utoa64_any_core
   end
  end
  local.get $2
  return
 )
 (func $~lib/number/U32#toString (param $0 i32) (param $1 i32) (result i32)
  local.get $0
  local.get $1
  call $~lib/util/number/utoa32
  return
 )
 (func $~lib/builtins/abort (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32)
  (local $4 i32)
  i32.const 1
  drop
  local.get $0
  if (result i32)
   local.get $0
  else
   i32.const 32
  end
  local.set $4
  local.get $1
  if
   local.get $4
   i32.const 64
   local.get $1
   call $~lib/string/String.__concat
   i32.const 128
   call $~lib/string/String.__concat
   local.get $2
   i32.const 10
   call $~lib/number/U32#toString
   call $~lib/string/String.__concat
   i32.const 128
   call $~lib/string/String.__concat
   local.get $3
   i32.const 10
   call $~lib/number/U32#toString
   call $~lib/string/String.__concat
   call $~lib/string/String.__concat
   local.set $4
  end
  local.get $4
  i32.const 1936
  i32.const 2626
  i32.const 5
  call $~lib/builtins/abort
  unreachable
 )
 (func $~lib/rt/stub/maybeGrowMemory (param $0 i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  memory.size
  local.set $1
  local.get $1
  i32.const 16
  i32.shl
  i32.const 15
  i32.add
  i32.const 15
  i32.const -1
  i32.xor
  i32.and
  local.set $2
  local.get $0
  local.get $2
  i32.gt_u
  if
   local.get $0
   local.get $2
   i32.sub
   i32.const 65535
   i32.add
   i32.const 65535
   i32.const -1
   i32.xor
   i32.and
   i32.const 16
   i32.shr_u
   local.set $3
   local.get $1
   local.tee $4
   local.get $3
   local.tee $5
   local.get $4
   local.get $5
   i32.gt_s
   select
   local.set $6
   local.get $6
   memory.grow
   i32.const 0
   i32.lt_s
   if
    local.get $3
    memory.grow
    i32.const 0
    i32.lt_s
    if
     unreachable
    end
   end
  end
  local.get $0
  global.set $~lib/rt/stub/offset
 )
 (func $~lib/rt/common/BLOCK#set:mmInfo (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store
 )
 (func $~lib/rt/stub/__alloc (param $0 i32) (result i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  local.get $0
  i32.const 1073741820
  i32.gt_u
  if
   i32.const 2000
   i32.const 2064
   i32.const 33
   i32.const 29
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/rt/stub/offset
  local.set $1
  global.get $~lib/rt/stub/offset
  i32.const 4
  i32.add
  local.set $2
  block $~lib/rt/stub/computeSize|inlined.0 (result i32)
   local.get $0
   local.set $3
   local.get $3
   i32.const 4
   i32.add
   i32.const 15
   i32.add
   i32.const 15
   i32.const -1
   i32.xor
   i32.and
   i32.const 4
   i32.sub
   br $~lib/rt/stub/computeSize|inlined.0
  end
  local.set $4
  local.get $2
  local.get $4
  i32.add
  call $~lib/rt/stub/maybeGrowMemory
  local.get $1
  local.get $4
  call $~lib/rt/common/BLOCK#set:mmInfo
  local.get $2
  return
 )
 (func $~lib/rt/common/OBJECT#set:gcInfo (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=4
 )
 (func $~lib/rt/common/OBJECT#set:gcInfo2 (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=8
 )
 (func $~lib/rt/common/OBJECT#set:rtId (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=12
 )
 (func $~lib/rt/common/OBJECT#set:rtSize (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=16
 )
 (func $~lib/rt/stub/__new (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  local.get $0
  i32.const 1073741804
  i32.gt_u
  if
   i32.const 2000
   i32.const 2064
   i32.const 86
   i32.const 30
   call $~lib/builtins/abort
   unreachable
  end
  i32.const 16
  local.get $0
  i32.add
  call $~lib/rt/stub/__alloc
  local.set $2
  local.get $2
  i32.const 4
  i32.sub
  local.set $3
  local.get $3
  i32.const 0
  call $~lib/rt/common/OBJECT#set:gcInfo
  local.get $3
  i32.const 0
  call $~lib/rt/common/OBJECT#set:gcInfo2
  local.get $3
  local.get $1
  call $~lib/rt/common/OBJECT#set:rtId
  local.get $3
  local.get $0
  call $~lib/rt/common/OBJECT#set:rtSize
  local.get $2
  i32.const 16
  i32.add
  return
 )
 (func $~lib/@btc-vision/as-bignum/assembly/integer/u128/u128#set:lo (param $0 i32) (param $1 i64)
  local.get $0
  local.get $1
  i64.store
 )
 (func $~lib/@btc-vision/as-bignum/assembly/integer/u128/u128#set:hi (param $0 i32) (param $1 i64)
  local.get $0
  local.get $1
  i64.store offset=8
 )
 (func $~lib/@btc-vision/as-bignum/assembly/integer/u128/u128#constructor (param $0 i32) (param $1 i64) (param $2 i64) (result i32)
  local.get $0
  i32.eqz
  if
   i32.const 16
   i32.const 4
   call $~lib/rt/stub/__new
   local.set $0
  end
  local.get $0
  local.get $1
  call $~lib/@btc-vision/as-bignum/assembly/integer/u128/u128#set:lo
  local.get $0
  local.get $2
  call $~lib/@btc-vision/as-bignum/assembly/integer/u128/u128#set:hi
  local.get $0
 )
 (func $start:~lib/@btc-vision/as-bignum/assembly/integer/u128
  global.get $~lib/memory/__heap_base
  i32.const 4
  i32.add
  i32.const 15
  i32.add
  i32.const 15
  i32.const -1
  i32.xor
  i32.and
  i32.const 4
  i32.sub
  global.set $~lib/rt/stub/startOffset
  global.get $~lib/rt/stub/startOffset
  global.set $~lib/rt/stub/offset
  i32.const 0
  i64.const 0
  i64.const 0
  call $~lib/@btc-vision/as-bignum/assembly/integer/u128/u128#constructor
  global.set $~lib/@btc-vision/as-bignum/assembly/integer/u128/u128._ZERO
  i32.const 0
  i64.const 1
  i64.const 0
  call $~lib/@btc-vision/as-bignum/assembly/integer/u128/u128#constructor
  global.set $~lib/@btc-vision/as-bignum/assembly/integer/u128/u128._ONE
  i32.const 0
  i64.const -1
  i64.const -1
  call $~lib/@btc-vision/as-bignum/assembly/integer/u128/u128#constructor
  global.set $~lib/@btc-vision/as-bignum/assembly/integer/u128/u128._MAX
 )
 (func $start:~lib/@btc-vision/as-bignum/assembly/integer/i128
  call $start:~lib/@btc-vision/as-bignum/assembly/integer/u128
 )
 (func $start:~lib/@btc-vision/as-bignum/assembly/integer/index
  call $start:~lib/@btc-vision/as-bignum/assembly/integer/i128
 )
 (func $start:~lib/@btc-vision/as-bignum/assembly/index
  call $start:~lib/@btc-vision/as-bignum/assembly/integer/index
 )
 (func $~lib/rt/stub/__link (param $0 i32) (param $1 i32) (param $2 i32)
 )
 (func $~lib/arraybuffer/ArrayBufferView#set:buffer (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store
  local.get $0
  local.get $1
  i32.const 0
  call $~lib/rt/stub/__link
 )
 (func $~lib/arraybuffer/ArrayBufferView#set:dataStart (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=4
 )
 (func $~lib/arraybuffer/ArrayBufferView#set:byteLength (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=8
 )
 (func $~lib/arraybuffer/ArrayBufferView#constructor (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  (local $3 i32)
  local.get $0
  i32.eqz
  if
   i32.const 12
   i32.const 3
   call $~lib/rt/stub/__new
   local.set $0
  end
  local.get $0
  i32.const 0
  call $~lib/arraybuffer/ArrayBufferView#set:buffer
  local.get $0
  i32.const 0
  call $~lib/arraybuffer/ArrayBufferView#set:dataStart
  local.get $0
  i32.const 0
  call $~lib/arraybuffer/ArrayBufferView#set:byteLength
  local.get $1
  i32.const 1073741820
  local.get $2
  i32.shr_u
  i32.gt_u
  if
   i32.const 2672
   i32.const 2720
   i32.const 19
   i32.const 57
   call $~lib/builtins/abort
   unreachable
  end
  local.get $1
  local.get $2
  i32.shl
  local.tee $1
  i32.const 1
  call $~lib/rt/stub/__new
  local.set $3
  i32.const 0
  global.get $~lib/shared/runtime/Runtime.Incremental
  i32.ne
  drop
  local.get $3
  i32.const 0
  local.get $1
  memory.fill
  local.get $0
  local.get $3
  call $~lib/arraybuffer/ArrayBufferView#set:buffer
  local.get $0
  local.get $3
  call $~lib/arraybuffer/ArrayBufferView#set:dataStart
  local.get $0
  local.get $1
  call $~lib/arraybuffer/ArrayBufferView#set:byteLength
  local.get $0
 )
 (func $~lib/typedarray/Uint8Array#constructor (param $0 i32) (param $1 i32) (result i32)
  local.get $0
  i32.eqz
  if
   i32.const 12
   i32.const 7
   call $~lib/rt/stub/__new
   local.set $0
  end
  local.get $0
  local.get $1
  i32.const 0
  call $~lib/arraybuffer/ArrayBufferView#constructor
  local.set $0
  local.get $0
 )
 (func $~lib/array/Array<u8>#get:length_ (param $0 i32) (result i32)
  local.get $0
  i32.load offset=12
 )
 (func $~lib/array/Array<u8>#get:length (param $0 i32) (result i32)
  local.get $0
  call $~lib/array/Array<u8>#get:length_
  return
 )
 (func $~lib/util/number/itoa32 (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  (local $10 i32)
  (local $11 i32)
  (local $12 i32)
  (local $13 i32)
  local.get $1
  i32.const 2
  i32.lt_s
  if (result i32)
   i32.const 1
  else
   local.get $1
   i32.const 36
   i32.gt_s
  end
  if
   i32.const 160
   i32.const 288
   i32.const 373
   i32.const 5
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  i32.eqz
  if
   i32.const 352
   return
  end
  local.get $0
  i32.const 31
  i32.shr_u
  i32.const 1
  i32.shl
  local.set $2
  local.get $2
  if
   i32.const 0
   local.get $0
   i32.sub
   local.set $0
  end
  local.get $1
  i32.const 10
  i32.eq
  if
   local.get $0
   call $~lib/util/number/decimalCount32
   local.set $4
   local.get $4
   i32.const 1
   i32.shl
   local.get $2
   i32.add
   i32.const 2
   call $~lib/rt/stub/__new
   local.set $3
   local.get $3
   local.get $2
   i32.add
   local.set $5
   local.get $0
   local.set $6
   local.get $4
   local.set $7
   i32.const 0
   i32.const 1
   i32.ge_s
   drop
   local.get $5
   local.get $6
   local.get $7
   call $~lib/util/number/utoa32_dec_lut
  else
   local.get $1
   i32.const 16
   i32.eq
   if
    i32.const 31
    local.get $0
    i32.clz
    i32.sub
    i32.const 2
    i32.shr_s
    i32.const 1
    i32.add
    local.set $8
    local.get $8
    i32.const 1
    i32.shl
    local.get $2
    i32.add
    i32.const 2
    call $~lib/rt/stub/__new
    local.set $3
    local.get $3
    local.get $2
    i32.add
    local.set $9
    local.get $0
    local.set $10
    local.get $8
    local.set $11
    i32.const 0
    i32.const 1
    i32.ge_s
    drop
    local.get $9
    local.get $10
    i64.extend_i32_u
    local.get $11
    call $~lib/util/number/utoa_hex_lut
   else
    local.get $0
    local.set $12
    local.get $12
    i64.extend_i32_u
    local.get $1
    call $~lib/util/number/ulog_base
    local.set $13
    local.get $13
    i32.const 1
    i32.shl
    local.get $2
    i32.add
    i32.const 2
    call $~lib/rt/stub/__new
    local.set $3
    local.get $3
    local.get $2
    i32.add
    local.get $12
    i64.extend_i32_u
    local.get $13
    local.get $1
    call $~lib/util/number/utoa64_any_core
   end
  end
  local.get $2
  if
   local.get $3
   i32.const 45
   i32.store16
  end
  local.get $3
  return
 )
 (func $~lib/number/I32#toString (param $0 i32) (param $1 i32) (result i32)
  local.get $0
  local.get $1
  call $~lib/util/number/itoa32
  return
 )
 (func $~lib/staticarray/StaticArray<~lib/string/String>#__uset (param $0 i32) (param $1 i32) (param $2 i32)
  local.get $0
  local.get $1
  i32.const 2
  i32.shl
  i32.add
  local.get $2
  i32.store
  i32.const 1
  drop
  local.get $0
  local.get $2
  i32.const 1
  call $~lib/rt/stub/__link
 )
 (func $~lib/staticarray/StaticArray<~lib/string/String>#get:length (param $0 i32) (result i32)
  local.get $0
  i32.const 20
  i32.sub
  call $~lib/rt/common/OBJECT#get:rtSize
  i32.const 2
  i32.shr_u
  return
 )
 (func $~lib/util/string/joinStringArray (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  (local $10 i32)
  (local $11 i32)
  (local $12 i32)
  local.get $1
  i32.const 1
  i32.sub
  local.set $3
  local.get $3
  i32.const 0
  i32.lt_s
  if
   i32.const 96
   return
  end
  local.get $3
  i32.eqz
  if
   local.get $0
   i32.load
   local.tee $4
   if (result i32)
    local.get $4
   else
    i32.const 96
   end
   return
  end
  i32.const 0
  local.set $5
  i32.const 0
  local.set $7
  loop $for-loop|0
   local.get $7
   local.get $1
   i32.lt_s
   if
    local.get $0
    local.get $7
    i32.const 2
    i32.shl
    i32.add
    i32.load
    local.set $6
    local.get $6
    i32.const 0
    i32.ne
    if
     local.get $5
     local.get $6
     call $~lib/string/String#get:length
     i32.add
     local.set $5
    end
    local.get $7
    i32.const 1
    i32.add
    local.set $7
    br $for-loop|0
   end
  end
  i32.const 0
  local.set $8
  local.get $2
  call $~lib/string/String#get:length
  local.set $9
  local.get $5
  local.get $9
  local.get $3
  i32.mul
  i32.add
  i32.const 1
  i32.shl
  i32.const 2
  call $~lib/rt/stub/__new
  local.set $10
  i32.const 0
  local.set $11
  loop $for-loop|1
   local.get $11
   local.get $3
   i32.lt_s
   if
    local.get $0
    local.get $11
    i32.const 2
    i32.shl
    i32.add
    i32.load
    local.set $6
    local.get $6
    i32.const 0
    i32.ne
    if
     local.get $6
     call $~lib/string/String#get:length
     local.set $12
     local.get $10
     local.get $8
     i32.const 1
     i32.shl
     i32.add
     local.get $6
     local.get $12
     i32.const 1
     i32.shl
     memory.copy
     local.get $8
     local.get $12
     i32.add
     local.set $8
    end
    local.get $9
    if
     local.get $10
     local.get $8
     i32.const 1
     i32.shl
     i32.add
     local.get $2
     local.get $9
     i32.const 1
     i32.shl
     memory.copy
     local.get $8
     local.get $9
     i32.add
     local.set $8
    end
    local.get $11
    i32.const 1
    i32.add
    local.set $11
    br $for-loop|1
   end
  end
  local.get $0
  local.get $3
  i32.const 2
  i32.shl
  i32.add
  i32.load
  local.set $6
  local.get $6
  i32.const 0
  i32.ne
  if
   local.get $10
   local.get $8
   i32.const 1
   i32.shl
   i32.add
   local.get $6
   local.get $6
   call $~lib/string/String#get:length
   i32.const 1
   i32.shl
   memory.copy
  end
  local.get $10
  return
 )
 (func $~lib/staticarray/StaticArray<~lib/string/String>#join (param $0 i32) (param $1 i32) (result i32)
  i32.const 0
  drop
  i32.const 0
  drop
  i32.const 0
  drop
  i32.const 0
  i32.const 1
  i32.lt_s
  drop
  i32.const 1
  drop
  local.get $0
  local.get $0
  call $~lib/staticarray/StaticArray<~lib/string/String>#get:length
  local.get $1
  call $~lib/util/string/joinStringArray
  return
 )
 (func $~lib/arraybuffer/ArrayBufferView#get:byteLength (param $0 i32) (result i32)
  local.get $0
  i32.load offset=8
 )
 (func $~lib/typedarray/Uint8Array#get:length (param $0 i32) (result i32)
  local.get $0
  call $~lib/arraybuffer/ArrayBufferView#get:byteLength
  return
 )
 (func $~lib/arraybuffer/ArrayBufferView#get:dataStart (param $0 i32) (result i32)
  local.get $0
  i32.load offset=4
 )
 (func $~lib/array/Array<u8>#get:dataStart (param $0 i32) (result i32)
  local.get $0
  i32.load offset=4
 )
 (func $~lib/typedarray/Uint8Array#set<~lib/array/Array<u8>> (param $0 i32) (param $1 i32) (param $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  local.get $0
  local.set $3
  local.get $1
  local.set $4
  local.get $2
  local.set $5
  i32.const 0
  drop
  local.get $4
  call $~lib/array/Array<u8>#get:length
  local.set $6
  local.get $5
  i32.const 0
  i32.lt_s
  if (result i32)
   i32.const 1
  else
   local.get $6
   local.get $5
   i32.add
   local.get $3
   call $~lib/typedarray/Uint8Array#get:length
   i32.gt_s
  end
  if
   i32.const 3056
   i32.const 3120
   i32.const 1902
   i32.const 5
   call $~lib/builtins/abort
   unreachable
  end
  local.get $3
  call $~lib/arraybuffer/ArrayBufferView#get:dataStart
  local.get $5
  i32.const 0
  i32.shl
  i32.add
  local.set $7
  local.get $4
  call $~lib/array/Array<u8>#get:dataStart
  local.set $8
  i32.const 0
  i32.eqz
  drop
  local.get $7
  local.get $8
  local.get $6
  i32.const 0
  i32.shl
  memory.copy
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/types/Address/Address#set:isDefined (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store8 offset=12
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/types/Address/Address#newSet<~lib/array/Array<u8>> (param $0 i32) (param $1 i32)
  (local $2 i32)
  local.get $1
  call $~lib/array/Array<u8>#get:length
  i32.const 32
  i32.ne
  if
   local.get $1
   call $~lib/array/Array<u8>#get:length
   i32.const 10
   call $~lib/number/I32#toString
   local.set $2
   i32.const 2896
   i32.const 1
   local.get $2
   call $~lib/staticarray/StaticArray<~lib/string/String>#__uset
   i32.const 2896
   i32.const 96
   call $~lib/staticarray/StaticArray<~lib/string/String>#join
   i32.const 2928
   i32.const 335
   i32.const 13
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  local.get $1
  i32.const 0
  call $~lib/typedarray/Uint8Array#set<~lib/array/Array<u8>>
  local.get $0
  i32.const 1
  call $~lib/@btc-vision/btc-runtime/runtime/types/Address/Address#set:isDefined
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/types/Address/Address#set:_mldsaPublicKey (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=16
  local.get $0
  local.get $1
  i32.const 0
  call $~lib/rt/stub/__link
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/types/Address/Address#constructor (param $0 i32) (param $1 i32) (result i32)
  local.get $0
  i32.eqz
  if
   i32.const 20
   i32.const 6
   call $~lib/rt/stub/__new
   local.set $0
  end
  local.get $0
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/types/Address/Address#set:isDefined
  local.get $0
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/types/Address/Address#set:_mldsaPublicKey
  local.get $0
  global.get $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/ADDRESS_BYTE_LENGTH
  call $~lib/typedarray/Uint8Array#constructor
  local.set $0
  local.get $1
  i32.eqz
  if (result i32)
   i32.const 1
  else
   local.get $1
   call $~lib/array/Array<u8>#get:length
   i32.const 0
   i32.eq
  end
  i32.eqz
  if
   local.get $0
   local.get $1
   call $~lib/@btc-vision/btc-runtime/runtime/types/Address/Address#newSet<~lib/array/Array<u8>>
  end
  local.get $0
 )
 (func $~lib/rt/__newBuffer (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  (local $3 i32)
  local.get $0
  local.get $1
  call $~lib/rt/stub/__new
  local.set $3
  local.get $2
  if
   local.get $3
   local.get $2
   local.get $0
   memory.copy
  end
  local.get $3
  return
 )
 (func $~lib/rt/__newArray (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32) (result i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  local.get $0
  local.get $1
  i32.shl
  local.set $4
  local.get $4
  i32.const 1
  local.get $3
  call $~lib/rt/__newBuffer
  local.set $5
  i32.const 16
  local.get $2
  call $~lib/rt/stub/__new
  local.set $6
  local.get $6
  local.get $5
  i32.store
  local.get $6
  local.get $5
  i32.const 0
  call $~lib/rt/stub/__link
  local.get $6
  local.get $5
  i32.store offset=4
  local.get $6
  local.get $4
  i32.store offset=8
  local.get $6
  local.get $0
  i32.store offset=12
  local.get $6
  return
 )
 (func $start:~lib/@btc-vision/btc-runtime/runtime/types/Address
  (local $0 i32)
  i32.const 0
  i32.const 0
  i32.const 0
  i32.const 8
  i32.const 3184
  call $~lib/rt/__newArray
  call $~lib/@btc-vision/btc-runtime/runtime/types/Address/Address#constructor
  global.set $~lib/@btc-vision/btc-runtime/runtime/types/Address/ZERO_ADDRESS
 )
 (func $start:~lib/@btc-vision/btc-runtime/runtime/generic/AddressMap
  call $start:~lib/@btc-vision/btc-runtime/runtime/types/Address
 )
 (func $~lib/array/Array<i32>#get:length_ (param $0 i32) (result i32)
  local.get $0
  i32.load offset=12
 )
 (func $~lib/array/Array<i32>#get:length (param $0 i32) (result i32)
  local.get $0
  call $~lib/array/Array<i32>#get:length_
  return
 )
 (func $~lib/array/Array<i32>#get:dataStart (param $0 i32) (result i32)
  local.get $0
  i32.load offset=4
 )
 (func $~lib/typedarray/Uint8Array#set<~lib/array/Array<i32>> (param $0 i32) (param $1 i32) (param $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  (local $10 i32)
  (local $11 i32)
  local.get $0
  local.set $3
  local.get $1
  local.set $4
  local.get $2
  local.set $5
  i32.const 0
  drop
  local.get $4
  call $~lib/array/Array<i32>#get:length
  local.set $6
  local.get $5
  i32.const 0
  i32.lt_s
  if (result i32)
   i32.const 1
  else
   local.get $6
   local.get $5
   i32.add
   local.get $3
   call $~lib/typedarray/Uint8Array#get:length
   i32.gt_s
  end
  if
   i32.const 3056
   i32.const 3120
   i32.const 1902
   i32.const 5
   call $~lib/builtins/abort
   unreachable
  end
  local.get $3
  call $~lib/arraybuffer/ArrayBufferView#get:dataStart
  local.get $5
  i32.const 0
  i32.shl
  i32.add
  local.set $7
  local.get $4
  call $~lib/array/Array<i32>#get:dataStart
  local.set $8
  i32.const 0
  i32.const 2
  i32.eq
  drop
  i32.const 0
  local.set $9
  loop $for-loop|0
   local.get $9
   local.get $6
   i32.lt_s
   if
    local.get $7
    local.get $9
    i32.const 0
    i32.shl
    i32.add
    local.set $10
    local.get $8
    local.get $9
    i32.const 2
    i32.shl
    i32.add
    i32.load
    local.set $11
    i32.const 0
    drop
    i32.const 0
    drop
    local.get $10
    local.get $11
    i32.store8
    local.get $9
    i32.const 1
    i32.add
    local.set $9
    br $for-loop|0
   end
  end
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/script/Networks/NetworkManager#set:mainnet (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store
  local.get $0
  local.get $1
  i32.const 0
  call $~lib/rt/stub/__link
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/script/Networks/NetworkManager#set:testnet (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=4
  local.get $0
  local.get $1
  i32.const 0
  call $~lib/rt/stub/__link
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/script/Networks/NetworkManager#set:regtest (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=8
  local.get $0
  local.get $1
  i32.const 0
  call $~lib/rt/stub/__link
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/script/Networks/NetworkManager#constructor (param $0 i32) (result i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  local.get $0
  i32.eqz
  if
   i32.const 12
   i32.const 11
   call $~lib/rt/stub/__new
   local.set $0
  end
  local.get $0
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/script/Networks/NetworkManager#set:mainnet
  local.get $0
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/script/Networks/NetworkManager#set:testnet
  local.get $0
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/script/Networks/NetworkManager#set:regtest
  i32.const 0
  i32.const 32
  call $~lib/typedarray/Uint8Array#constructor
  local.set $1
  local.get $1
  i32.const 32
  i32.const 2
  i32.const 10
  i32.const 3216
  call $~lib/rt/__newArray
  i32.const 0
  call $~lib/typedarray/Uint8Array#set<~lib/array/Array<i32>>
  i32.const 0
  i32.const 32
  call $~lib/typedarray/Uint8Array#constructor
  local.set $3
  local.get $3
  i32.const 32
  i32.const 2
  i32.const 10
  i32.const 3376
  call $~lib/rt/__newArray
  i32.const 0
  call $~lib/typedarray/Uint8Array#set<~lib/array/Array<i32>>
  i32.const 0
  i32.const 32
  call $~lib/typedarray/Uint8Array#constructor
  local.set $5
  local.get $5
  i32.const 32
  i32.const 2
  i32.const 10
  i32.const 3536
  call $~lib/rt/__newArray
  i32.const 0
  call $~lib/typedarray/Uint8Array#set<~lib/array/Array<i32>>
  local.get $0
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/script/Networks/NetworkManager#set:mainnet
  local.get $0
  local.get $3
  call $~lib/@btc-vision/btc-runtime/runtime/script/Networks/NetworkManager#set:testnet
  local.get $0
  local.get $5
  call $~lib/@btc-vision/btc-runtime/runtime/script/Networks/NetworkManager#set:regtest
  local.get $0
 )
 (func $start:~lib/@btc-vision/btc-runtime/runtime/script/Networks
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/script/Networks/NetworkManager#constructor
  global.set $~lib/@btc-vision/btc-runtime/runtime/script/Networks/Network
 )
 (func $~lib/typedarray/Uint8Array#__set (param $0 i32) (param $1 i32) (param $2 i32)
  local.get $1
  local.get $0
  call $~lib/arraybuffer/ArrayBufferView#get:byteLength
  i32.ge_u
  if
   i32.const 3056
   i32.const 3120
   i32.const 178
   i32.const 45
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  call $~lib/arraybuffer/ArrayBufferView#get:dataStart
  local.get $1
  i32.add
  local.get $2
  i32.store8
 )
 (func $start:~lib/@btc-vision/btc-runtime/runtime/math/bytes
  i32.const 0
  i32.const 32
  call $~lib/typedarray/Uint8Array#constructor
  global.set $~lib/@btc-vision/btc-runtime/runtime/math/bytes/EMPTY_BUFFER
  i32.const 0
  i32.const 30
  call $~lib/typedarray/Uint8Array#constructor
  global.set $~lib/@btc-vision/btc-runtime/runtime/math/bytes/EMPTY_POINTER
  i32.const 0
  i32.const 32
  call $~lib/typedarray/Uint8Array#constructor
  global.set $~lib/@btc-vision/btc-runtime/runtime/math/bytes/ONE_BUFFER
  global.get $~lib/@btc-vision/btc-runtime/runtime/math/bytes/ONE_BUFFER
  i32.const 31
  i32.const 1
  call $~lib/typedarray/Uint8Array#__set
 )
 (func $start:~lib/@btc-vision/btc-runtime/runtime/math/abi
  call $start:~lib/@btc-vision/btc-runtime/runtime/math/bytes
 )
 (func $start:~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter
  call $start:~lib/@btc-vision/btc-runtime/runtime/math/abi
 )
 (func $start:~lib/@btc-vision/btc-runtime/runtime/script/Bech32
  call $start:~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter
 )
 (func $start:~lib/@btc-vision/btc-runtime/runtime/script/Segwit
  call $start:~lib/@btc-vision/btc-runtime/runtime/script/Bech32
 )
 (func $start:~lib/@btc-vision/btc-runtime/runtime/script/BitcoinAddresses
  call $start:~lib/@btc-vision/btc-runtime/runtime/script/Segwit
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/types/ExtendedAddress/ExtendedAddress#set:tweakedPublicKey (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=20
  local.get $0
  local.get $1
  i32.const 0
  call $~lib/rt/stub/__link
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/types/ExtendedAddress/ExtendedAddress#get:tweakedPublicKey (param $0 i32) (result i32)
  local.get $0
  i32.load offset=20
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/types/ExtendedAddress/ExtendedAddress#constructor (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  local.get $0
  i32.eqz
  if
   i32.const 24
   i32.const 14
   call $~lib/rt/stub/__new
   local.set $0
  end
  local.get $0
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/types/ExtendedAddress/ExtendedAddress#set:tweakedPublicKey
  local.get $0
  local.get $2
  call $~lib/@btc-vision/btc-runtime/runtime/types/Address/Address#constructor
  local.set $0
  local.get $1
  call $~lib/array/Array<u8>#get:length
  i32.const 32
  i32.ne
  if
   i32.const 4080
   i32.const 4192
   i32.const 71
   i32.const 13
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  i32.const 0
  i32.const 32
  call $~lib/typedarray/Uint8Array#constructor
  call $~lib/@btc-vision/btc-runtime/runtime/types/ExtendedAddress/ExtendedAddress#set:tweakedPublicKey
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/types/ExtendedAddress/ExtendedAddress#get:tweakedPublicKey
  local.get $1
  i32.const 0
  call $~lib/typedarray/Uint8Array#set<~lib/array/Array<u8>>
  local.get $0
 )
 (func $start:~lib/@btc-vision/btc-runtime/runtime/types/ExtendedAddress
  call $start:~lib/@btc-vision/btc-runtime/runtime/script/Networks
  call $start:~lib/@btc-vision/btc-runtime/runtime/script/BitcoinAddresses
  i32.const 0
  global.get $~lib/@btc-vision/btc-runtime/runtime/types/ExtendedAddressCache/ZERO_ARRAY
  global.get $~lib/@btc-vision/btc-runtime/runtime/types/ExtendedAddressCache/ZERO_ARRAY
  call $~lib/@btc-vision/btc-runtime/runtime/types/ExtendedAddress/ExtendedAddress#constructor
  global.set $~lib/@btc-vision/btc-runtime/runtime/types/ExtendedAddress/ZERO_BITCOIN_ADDRESS
  i32.const 0
  global.get $~lib/@btc-vision/btc-runtime/runtime/types/ExtendedAddressCache/DEAD_ARRAY
  global.get $~lib/@btc-vision/btc-runtime/runtime/types/ExtendedAddressCache/ZERO_ARRAY
  call $~lib/@btc-vision/btc-runtime/runtime/types/ExtendedAddress/ExtendedAddress#constructor
  global.set $~lib/@btc-vision/btc-runtime/runtime/types/ExtendedAddress/DEAD_ADDRESS
 )
 (func $start:~lib/@btc-vision/btc-runtime/runtime/generic/ExtendedAddressMap
  call $start:~lib/@btc-vision/btc-runtime/runtime/types/ExtendedAddress
 )
 (func $start:~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader
  call $start:~lib/@btc-vision/btc-runtime/runtime/generic/AddressMap
  call $start:~lib/@btc-vision/btc-runtime/runtime/generic/ExtendedAddressMap
 )
 (func $~lib/arraybuffer/ArrayBuffer#constructor (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  local.get $1
  i32.const 1073741820
  i32.gt_u
  if
   i32.const 2672
   i32.const 2720
   i32.const 52
   i32.const 43
   call $~lib/builtins/abort
   unreachable
  end
  local.get $1
  i32.const 1
  call $~lib/rt/stub/__new
  local.set $2
  i32.const 0
  global.get $~lib/shared/runtime/Runtime.Incremental
  i32.ne
  drop
  local.get $2
  i32.const 0
  local.get $1
  memory.fill
  local.get $2
  return
 )
 (func $~lib/arraybuffer/ArrayBuffer#get:byteLength (param $0 i32) (result i32)
  local.get $0
  i32.const 20
  i32.sub
  call $~lib/rt/common/OBJECT#get:rtSize
  return
 )
 (func $~lib/typedarray/Uint8Array.wrap (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  block $"~lib/typedarray/WRAP<~lib/typedarray/Uint8Array,u8>|inlined.0" (result i32)
   local.get $0
   local.set $3
   local.get $1
   local.set $4
   local.get $2
   local.set $5
   local.get $3
   call $~lib/arraybuffer/ArrayBuffer#get:byteLength
   local.set $7
   local.get $4
   local.get $7
   i32.gt_u
   local.get $4
   i32.const 0
   i32.and
   i32.or
   if
    i32.const 3056
    i32.const 3120
    i32.const 1860
    i32.const 5
    call $~lib/builtins/abort
    unreachable
   end
   local.get $5
   i32.const 0
   i32.lt_s
   if
    local.get $5
    i32.const -1
    i32.eq
    if
     local.get $7
     i32.const 0
     i32.and
     if
      i32.const 2672
      i32.const 3120
      i32.const 1865
      i32.const 9
      call $~lib/builtins/abort
      unreachable
     end
     local.get $7
     local.get $4
     i32.sub
     local.set $6
    else
     i32.const 2672
     i32.const 3120
     i32.const 1869
     i32.const 7
     call $~lib/builtins/abort
     unreachable
    end
   else
    local.get $5
    i32.const 0
    i32.shl
    local.set $6
    local.get $4
    local.get $6
    i32.add
    local.get $7
    i32.gt_s
    if
     i32.const 2672
     i32.const 3120
     i32.const 1874
     i32.const 7
     call $~lib/builtins/abort
     unreachable
    end
   end
   i32.const 12
   i32.const 7
   call $~lib/rt/stub/__new
   local.set $8
   local.get $8
   local.get $3
   i32.store
   local.get $8
   local.get $3
   i32.const 0
   call $~lib/rt/stub/__link
   local.get $8
   local.get $6
   i32.store offset=8
   local.get $8
   local.get $3
   local.get $4
   i32.add
   i32.store offset=4
   local.get $8
   br $"~lib/typedarray/WRAP<~lib/typedarray/Uint8Array,u8>|inlined.0"
  end
  return
 )
 (func $~lib/typedarray/Uint8Array.wrap@varargs (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  block $2of2
   block $1of2
    block $0of2
     block $outOfRange
      global.get $~argumentsLength
      i32.const 1
      i32.sub
      br_table $0of2 $1of2 $2of2 $outOfRange
     end
     unreachable
    end
    i32.const 0
    local.set $1
   end
   i32.const -1
   local.set $2
  end
  local.get $0
  local.get $1
  local.get $2
  call $~lib/typedarray/Uint8Array.wrap
 )
 (func $start:~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment
  call $start:~lib/@btc-vision/as-bignum/assembly/index
  call $start:~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader
  i32.const 0
  global.get $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/SCRATCH_SIZE
  call $~lib/arraybuffer/ArrayBuffer#constructor
  global.set $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/SCRATCH_BUF
  global.get $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/SCRATCH_BUF
  i32.const 0
  i32.const 1
  global.set $~argumentsLength
  i32.const 0
  call $~lib/typedarray/Uint8Array.wrap@varargs
  global.set $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/SCRATCH_VIEW
  i32.const 0
  i32.const 4
  call $~lib/typedarray/Uint8Array#constructor
  global.set $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/FOUR_BYTES_UINT8ARRAY_MEMORY_CACHE
 )
 (func $~lib/object/Object#constructor (param $0 i32) (result i32)
  local.get $0
  i32.eqz
  if
   i32.const 0
   i32.const 0
   call $~lib/rt/stub/__new
   local.set $0
  end
  local.get $0
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/types/ExtendedAddressCache/getCachedDeadAddress (result i32)
  global.get $~lib/@btc-vision/btc-runtime/runtime/types/ExtendedAddressCache/_cachedDeadAddress
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/types/ExtendedAddressCache/setCachedDeadAddress (param $0 i32)
  local.get $0
  global.set $~lib/@btc-vision/btc-runtime/runtime/types/ExtendedAddressCache/_cachedDeadAddress
 )
 (func $~lib/array/Array<u8>#set:buffer (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store
  local.get $0
  local.get $1
  i32.const 0
  call $~lib/rt/stub/__link
 )
 (func $~lib/array/Array<u8>#set:dataStart (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=4
 )
 (func $~lib/array/Array<u8>#set:byteLength (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=8
 )
 (func $~lib/array/Array<u8>#set:length_ (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=12
 )
 (func $~lib/array/Array<u8>#constructor (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  local.get $0
  i32.eqz
  if
   i32.const 16
   i32.const 8
   call $~lib/rt/stub/__new
   local.set $0
  end
  local.get $0
  i32.const 0
  call $~lib/array/Array<u8>#set:buffer
  local.get $0
  i32.const 0
  call $~lib/array/Array<u8>#set:dataStart
  local.get $0
  i32.const 0
  call $~lib/array/Array<u8>#set:byteLength
  local.get $0
  i32.const 0
  call $~lib/array/Array<u8>#set:length_
  local.get $1
  i32.const 1073741820
  i32.const 0
  i32.shr_u
  i32.gt_u
  if
   i32.const 2672
   i32.const 4336
   i32.const 70
   i32.const 60
   call $~lib/builtins/abort
   unreachable
  end
  local.get $1
  local.tee $2
  i32.const 8
  local.tee $3
  local.get $2
  local.get $3
  i32.gt_u
  select
  i32.const 0
  i32.shl
  local.set $4
  local.get $4
  i32.const 1
  call $~lib/rt/stub/__new
  local.set $5
  i32.const 0
  global.get $~lib/shared/runtime/Runtime.Incremental
  i32.ne
  drop
  local.get $5
  i32.const 0
  local.get $4
  memory.fill
  local.get $0
  local.get $5
  call $~lib/array/Array<u8>#set:buffer
  local.get $0
  local.get $5
  call $~lib/array/Array<u8>#set:dataStart
  local.get $0
  local.get $4
  call $~lib/array/Array<u8>#set:byteLength
  local.get $0
  local.get $1
  call $~lib/array/Array<u8>#set:length_
  local.get $0
 )
 (func $~lib/typedarray/Uint8Array#__get (param $0 i32) (param $1 i32) (result i32)
  local.get $1
  local.get $0
  call $~lib/arraybuffer/ArrayBufferView#get:byteLength
  i32.ge_u
  if
   i32.const 3056
   i32.const 3120
   i32.const 167
   i32.const 45
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  call $~lib/arraybuffer/ArrayBufferView#get:dataStart
  local.get $1
  i32.add
  i32.load8_u
  return
 )
 (func $~lib/arraybuffer/ArrayBufferView#get:buffer (param $0 i32) (result i32)
  local.get $0
  i32.load
 )
 (func $~lib/rt/common/BLOCK#get:mmInfo (param $0 i32) (result i32)
  local.get $0
  i32.load
 )
 (func $~lib/rt/stub/__realloc (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  local.get $0
  i32.const 0
  i32.ne
  if (result i32)
   local.get $0
   i32.const 15
   i32.and
   i32.eqz
  else
   i32.const 0
  end
  i32.eqz
  if
   i32.const 0
   i32.const 2064
   i32.const 45
   i32.const 3
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  i32.const 4
  i32.sub
  local.set $2
  local.get $2
  call $~lib/rt/common/BLOCK#get:mmInfo
  local.set $3
  local.get $0
  local.get $3
  i32.add
  global.get $~lib/rt/stub/offset
  i32.eq
  local.set $4
  block $~lib/rt/stub/computeSize|inlined.1 (result i32)
   local.get $1
   local.set $5
   local.get $5
   i32.const 4
   i32.add
   i32.const 15
   i32.add
   i32.const 15
   i32.const -1
   i32.xor
   i32.and
   i32.const 4
   i32.sub
   br $~lib/rt/stub/computeSize|inlined.1
  end
  local.set $6
  local.get $1
  local.get $3
  i32.gt_u
  if
   local.get $4
   if
    local.get $1
    i32.const 1073741820
    i32.gt_u
    if
     i32.const 2000
     i32.const 2064
     i32.const 52
     i32.const 33
     call $~lib/builtins/abort
     unreachable
    end
    local.get $0
    local.get $6
    i32.add
    call $~lib/rt/stub/maybeGrowMemory
    local.get $2
    local.get $6
    call $~lib/rt/common/BLOCK#set:mmInfo
   else
    local.get $6
    local.tee $7
    local.get $3
    i32.const 1
    i32.shl
    local.tee $8
    local.get $7
    local.get $8
    i32.gt_u
    select
    call $~lib/rt/stub/__alloc
    local.set $9
    local.get $9
    local.get $0
    local.get $3
    memory.copy
    local.get $9
    local.tee $0
    i32.const 4
    i32.sub
    local.set $2
   end
  else
   local.get $4
   if
    local.get $0
    local.get $6
    i32.add
    global.set $~lib/rt/stub/offset
    local.get $2
    local.get $6
    call $~lib/rt/common/BLOCK#set:mmInfo
   end
  end
  local.get $0
  return
 )
 (func $~lib/rt/stub/__renew (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  local.get $1
  i32.const 1073741804
  i32.gt_u
  if
   i32.const 2000
   i32.const 2064
   i32.const 99
   i32.const 30
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  i32.const 16
  i32.sub
  i32.const 16
  local.get $1
  i32.add
  call $~lib/rt/stub/__realloc
  local.set $2
  local.get $2
  i32.const 4
  i32.sub
  local.get $1
  call $~lib/rt/common/OBJECT#set:rtSize
  local.get $2
  i32.const 16
  i32.add
  return
 )
 (func $~lib/array/ensureCapacity (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  (local $10 i32)
  (local $11 i32)
  (local $12 i32)
  (local $13 i32)
  local.get $0
  call $~lib/arraybuffer/ArrayBufferView#get:byteLength
  local.set $4
  local.get $1
  local.get $4
  local.get $2
  i32.shr_u
  i32.gt_u
  if
   local.get $1
   i32.const 1073741820
   local.get $2
   i32.shr_u
   i32.gt_u
   if
    i32.const 2672
    i32.const 4336
    i32.const 19
    i32.const 48
    call $~lib/builtins/abort
    unreachable
   end
   local.get $0
   call $~lib/arraybuffer/ArrayBufferView#get:buffer
   local.set $5
   local.get $1
   local.tee $6
   i32.const 8
   local.tee $7
   local.get $6
   local.get $7
   i32.gt_u
   select
   local.get $2
   i32.shl
   local.set $8
   local.get $3
   if
    local.get $4
    i32.const 1
    i32.shl
    local.tee $9
    i32.const 1073741820
    local.tee $10
    local.get $9
    local.get $10
    i32.lt_u
    select
    local.tee $11
    local.get $8
    local.tee $12
    local.get $11
    local.get $12
    i32.gt_u
    select
    local.set $8
   end
   local.get $5
   local.get $8
   call $~lib/rt/stub/__renew
   local.set $13
   i32.const 0
   global.get $~lib/shared/runtime/Runtime.Incremental
   i32.ne
   drop
   local.get $13
   local.get $4
   i32.add
   i32.const 0
   local.get $8
   local.get $4
   i32.sub
   memory.fill
   local.get $13
   local.get $5
   i32.ne
   if
    local.get $0
    local.get $13
    i32.store
    local.get $0
    local.get $13
    i32.store offset=4
    local.get $0
    local.get $13
    i32.const 0
    call $~lib/rt/stub/__link
   end
   local.get $0
   local.get $8
   i32.store offset=8
  end
 )
 (func $~lib/array/Array<u8>#__set (param $0 i32) (param $1 i32) (param $2 i32)
  local.get $1
  local.get $0
  call $~lib/array/Array<u8>#get:length_
  i32.ge_u
  if
   local.get $1
   i32.const 0
   i32.lt_s
   if
    i32.const 3056
    i32.const 4336
    i32.const 130
    i32.const 22
    call $~lib/builtins/abort
    unreachable
   end
   local.get $0
   local.get $1
   i32.const 1
   i32.add
   i32.const 0
   i32.const 1
   call $~lib/array/ensureCapacity
   local.get $0
   local.get $1
   i32.const 1
   i32.add
   call $~lib/array/Array<u8>#set:length_
  end
  local.get $0
  call $~lib/array/Array<u8>#get:dataStart
  local.get $1
  i32.const 0
  i32.shl
  i32.add
  local.get $2
  i32.store8
  i32.const 0
  drop
 )
 (func $~lib/typedarray/Uint8Array#slice (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  (local $10 i32)
  (local $11 i32)
  (local $12 i32)
  (local $13 i32)
  (local $14 i32)
  (local $15 i32)
  (local $16 i32)
  (local $17 i32)
  block $"~lib/typedarray/SLICE<~lib/typedarray/Uint8Array,u8>|inlined.0" (result i32)
   local.get $0
   local.set $3
   local.get $1
   local.set $4
   local.get $2
   local.set $5
   local.get $3
   call $~lib/typedarray/Uint8Array#get:length
   local.set $6
   local.get $4
   i32.const 0
   i32.lt_s
   if (result i32)
    local.get $4
    local.get $6
    i32.add
    local.tee $7
    i32.const 0
    local.tee $8
    local.get $7
    local.get $8
    i32.gt_s
    select
   else
    local.get $4
    local.tee $9
    local.get $6
    local.tee $10
    local.get $9
    local.get $10
    i32.lt_s
    select
   end
   local.set $4
   local.get $5
   i32.const 0
   i32.lt_s
   if (result i32)
    local.get $5
    local.get $6
    i32.add
    local.tee $11
    i32.const 0
    local.tee $12
    local.get $11
    local.get $12
    i32.gt_s
    select
   else
    local.get $5
    local.tee $13
    local.get $6
    local.tee $14
    local.get $13
    local.get $14
    i32.lt_s
    select
   end
   local.set $5
   local.get $5
   local.get $4
   i32.sub
   local.tee $15
   i32.const 0
   local.tee $16
   local.get $15
   local.get $16
   i32.gt_s
   select
   local.set $6
   i32.const 0
   local.get $6
   call $~lib/typedarray/Uint8Array#constructor
   local.set $17
   local.get $17
   call $~lib/arraybuffer/ArrayBufferView#get:dataStart
   local.get $3
   call $~lib/arraybuffer/ArrayBufferView#get:dataStart
   local.get $4
   i32.const 0
   i32.shl
   i32.add
   local.get $6
   i32.const 0
   i32.shl
   memory.copy
   local.get $17
   br $"~lib/typedarray/SLICE<~lib/typedarray/Uint8Array,u8>|inlined.0"
  end
  return
 )
 (func $~lib/typedarray/Uint8Array#slice@varargs (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  block $2of2
   block $1of2
    block $0of2
     block $outOfRange
      global.get $~argumentsLength
      br_table $0of2 $1of2 $2of2 $outOfRange
     end
     unreachable
    end
    i32.const 0
    local.set $1
   end
   global.get $~lib/builtins/i32.MAX_VALUE
   local.set $2
  end
  local.get $0
  local.get $1
  local.get $2
  call $~lib/typedarray/Uint8Array#slice
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/types/Address/Address#get:isDefined (param $0 i32) (result i32)
  local.get $0
  i32.load8_u offset=12
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/types/ExtendedAddress/ExtendedAddress#clone (param $0 i32) (result i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  i32.const 0
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/types/ExtendedAddress/ExtendedAddress#get:tweakedPublicKey
  call $~lib/typedarray/Uint8Array#get:length
  call $~lib/array/Array<u8>#constructor
  local.set $1
  i32.const 0
  local.set $2
  loop $for-loop|0
   local.get $2
   local.get $0
   call $~lib/@btc-vision/btc-runtime/runtime/types/ExtendedAddress/ExtendedAddress#get:tweakedPublicKey
   call $~lib/typedarray/Uint8Array#get:length
   i32.lt_s
   if
    local.get $1
    local.get $2
    local.get $0
    call $~lib/@btc-vision/btc-runtime/runtime/types/ExtendedAddress/ExtendedAddress#get:tweakedPublicKey
    local.get $2
    call $~lib/typedarray/Uint8Array#__get
    call $~lib/array/Array<u8>#__set
    local.get $2
    i32.const 1
    i32.add
    local.set $2
    br $for-loop|0
   end
  end
  local.get $0
  i32.const 0
  i32.const 1
  global.set $~argumentsLength
  i32.const 0
  call $~lib/typedarray/Uint8Array#slice@varargs
  local.set $3
  i32.const 0
  local.get $3
  call $~lib/typedarray/Uint8Array#get:length
  call $~lib/array/Array<u8>#constructor
  local.set $4
  i32.const 0
  local.set $5
  loop $for-loop|1
   local.get $5
   local.get $3
   call $~lib/typedarray/Uint8Array#get:length
   i32.lt_s
   if
    local.get $4
    local.get $5
    local.get $3
    local.get $5
    call $~lib/typedarray/Uint8Array#__get
    call $~lib/array/Array<u8>#__set
    local.get $5
    i32.const 1
    i32.add
    local.set $5
    br $for-loop|1
   end
  end
  i32.const 0
  local.get $1
  local.get $4
  call $~lib/@btc-vision/btc-runtime/runtime/types/ExtendedAddress/ExtendedAddress#constructor
  local.set $6
  local.get $6
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/types/Address/Address#get:isDefined
  call $~lib/@btc-vision/btc-runtime/runtime/types/Address/Address#set:isDefined
  local.get $6
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/types/ExtendedAddress/ExtendedAddress.dead (result i32)
  (local $0 i32)
  (local $1 i32)
  call $~lib/@btc-vision/btc-runtime/runtime/types/ExtendedAddressCache/getCachedDeadAddress
  local.set $0
  local.get $0
  i32.const 0
  i32.eq
  if
   i32.const 0
   global.get $~lib/@btc-vision/btc-runtime/runtime/types/ExtendedAddressCache/DEAD_ARRAY
   global.get $~lib/@btc-vision/btc-runtime/runtime/types/ExtendedAddressCache/ZERO_ARRAY
   call $~lib/@btc-vision/btc-runtime/runtime/types/ExtendedAddress/ExtendedAddress#constructor
   local.set $1
   local.get $1
   local.set $0
   local.get $0
   call $~lib/@btc-vision/btc-runtime/runtime/types/ExtendedAddressCache/setCachedDeadAddress
  end
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/types/ExtendedAddress/ExtendedAddress#clone
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#set:DEAD_ADDRESS (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store
  local.get $0
  local.get $1
  i32.const 0
  call $~lib/rt/stub/__link
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/generic/MapUint8Array/MapUint8Array#set:_keys (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store
  local.get $0
  local.get $1
  i32.const 0
  call $~lib/rt/stub/__link
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/generic/MapUint8Array/MapUint8Array#set:_values (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=4
  local.get $0
  local.get $1
  i32.const 0
  call $~lib/rt/stub/__link
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/generic/MapUint8Array/MapUint8Array#set:_lastIndex (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=8
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/generic/MapUint8Array/MapUint8Array#constructor (param $0 i32) (result i32)
  (local $1 i32)
  (local $2 i32)
  local.get $0
  i32.eqz
  if
   i32.const 12
   i32.const 16
   call $~lib/rt/stub/__new
   local.set $0
  end
  local.get $0
  call $~lib/object/Object#constructor
  local.set $0
  local.get $0
  i32.const 0
  i32.const 2
  i32.const 18
  i32.const 4384
  call $~lib/rt/__newArray
  call $~lib/@btc-vision/btc-runtime/runtime/generic/MapUint8Array/MapUint8Array#set:_keys
  local.get $0
  i32.const 0
  i32.const 2
  i32.const 18
  i32.const 4416
  call $~lib/rt/__newArray
  call $~lib/@btc-vision/btc-runtime/runtime/generic/MapUint8Array/MapUint8Array#set:_values
  local.get $0
  i32.const -1
  call $~lib/@btc-vision/btc-runtime/runtime/generic/MapUint8Array/MapUint8Array#set:_lastIndex
  local.get $0
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#set:storage (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=4
  local.get $0
  local.get $1
  i32.const 0
  call $~lib/rt/stub/__link
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#set:transientStorage (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=8
  local.get $0
  local.get $1
  i32.const 0
  call $~lib/rt/stub/__link
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#set:_selfContract (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=12
  local.get $0
  local.get $1
  i32.const 0
  call $~lib/rt/stub/__link
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#set:_network (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=16
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#set:_block (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=20
  local.get $0
  local.get $1
  i32.const 0
  call $~lib/rt/stub/__link
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#set:_tx (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=24
  local.get $0
  local.get $1
  i32.const 0
  call $~lib/rt/stub/__link
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#set:_contract (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=28
  local.get $0
  local.get $1
  i32.const 0
  call $~lib/rt/stub/__link
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#set:_nextPointer (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store16 offset=32
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#set:_contractDeployer (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=36
  local.get $0
  local.get $1
  i32.const 0
  call $~lib/rt/stub/__link
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#set:_contractAddress (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=40
  local.get $0
  local.get $1
  i32.const 0
  call $~lib/rt/stub/__link
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#set:_chainId (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=44
  local.get $0
  local.get $1
  i32.const 0
  call $~lib/rt/stub/__link
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#set:_protocolId (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=48
  local.get $0
  local.get $1
  i32.const 0
  call $~lib/rt/stub/__link
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#constructor (param $0 i32) (result i32)
  local.get $0
  i32.eqz
  if
   i32.const 52
   i32.const 15
   call $~lib/rt/stub/__new
   local.set $0
  end
  local.get $0
  call $~lib/object/Object#constructor
  local.set $0
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/types/ExtendedAddress/ExtendedAddress.dead
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#set:DEAD_ADDRESS
  local.get $0
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/generic/MapUint8Array/MapUint8Array#constructor
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#set:storage
  local.get $0
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/generic/MapUint8Array/MapUint8Array#constructor
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#set:transientStorage
  local.get $0
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#set:_selfContract
  local.get $0
  global.get $~lib/@btc-vision/btc-runtime/runtime/script/Networks/Networks.Unknown
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#set:_network
  local.get $0
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#set:_block
  local.get $0
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#set:_tx
  local.get $0
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#set:_contract
  local.get $0
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#set:_nextPointer
  local.get $0
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#set:_contractDeployer
  local.get $0
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#set:_contractAddress
  local.get $0
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#set:_chainId
  local.get $0
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#set:_protocolId
  local.get $0
 )
 (func $start:~lib/@btc-vision/btc-runtime/runtime/env/index
  call $start:~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#constructor
  global.set $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
 )
 (func $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#set:lo1 (param $0 i32) (param $1 i64)
  local.get $0
  local.get $1
  i64.store
 )
 (func $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#set:lo2 (param $0 i32) (param $1 i64)
  local.get $0
  local.get $1
  i64.store offset=8
 )
 (func $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#set:hi1 (param $0 i32) (param $1 i64)
  local.get $0
  local.get $1
  i64.store offset=16
 )
 (func $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#set:hi2 (param $0 i32) (param $1 i64)
  local.get $0
  local.get $1
  i64.store offset=24
 )
 (func $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#constructor (param $0 i32) (param $1 i64) (param $2 i64) (param $3 i64) (param $4 i64) (result i32)
  local.get $0
  i32.eqz
  if
   i32.const 32
   i32.const 24
   call $~lib/rt/stub/__new
   local.set $0
  end
  local.get $0
  local.get $1
  call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#set:lo1
  local.get $0
  local.get $2
  call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#set:lo2
  local.get $0
  local.get $3
  call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#set:hi1
  local.get $0
  local.get $4
  call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#set:hi2
  local.get $0
 )
 (func $start:~lib/@btc-vision/btc-runtime/runtime/types/SafeMath
  (local $0 i32)
  (local $1 i32)
  (local $2 i32)
  block $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.get:Zero|inlined.0 (result i32)
   i32.const 0
   i64.const 0
   i64.const 0
   i64.const 0
   i64.const 0
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#constructor
   br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.get:Zero|inlined.0
  end
  global.set $~lib/@btc-vision/btc-runtime/runtime/types/SafeMath/SafeMath.ZERO
  block $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.get:One|inlined.0 (result i32)
   i32.const 0
   i64.const 1
   i64.const 0
   i64.const 0
   i64.const 0
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#constructor
   br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.get:One|inlined.0
  end
  global.set $~lib/@btc-vision/btc-runtime/runtime/types/SafeMath/SafeMath.ONE
  block $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.fromU32|inlined.0 (result i32)
   i32.const 2
   local.set $0
   local.get $0
   i32.const 0
   i32.eq
   if
    block $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.get:Zero|inlined.1 (result i32)
     i32.const 0
     i64.const 0
     i64.const 0
     i64.const 0
     i64.const 0
     call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#constructor
     br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.get:Zero|inlined.1
    end
    br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.fromU32|inlined.0
   end
   local.get $0
   i32.const 1
   i32.eq
   if
    block $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.get:One|inlined.1 (result i32)
     i32.const 0
     i64.const 1
     i64.const 0
     i64.const 0
     i64.const 0
     call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#constructor
     br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.get:One|inlined.1
    end
    br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.fromU32|inlined.0
   end
   i32.const 0
   local.get $0
   i64.extend_i32_u
   i64.const 0
   i64.const 0
   i64.const 0
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#constructor
   br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.fromU32|inlined.0
  end
  global.set $~lib/@btc-vision/btc-runtime/runtime/types/SafeMath/SafeMath.CONST_2
  block $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.fromU32|inlined.1 (result i32)
   i32.const 3
   local.set $1
   local.get $1
   i32.const 0
   i32.eq
   if
    block $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.get:Zero|inlined.2 (result i32)
     i32.const 0
     i64.const 0
     i64.const 0
     i64.const 0
     i64.const 0
     call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#constructor
     br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.get:Zero|inlined.2
    end
    br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.fromU32|inlined.1
   end
   local.get $1
   i32.const 1
   i32.eq
   if
    block $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.get:One|inlined.2 (result i32)
     i32.const 0
     i64.const 1
     i64.const 0
     i64.const 0
     i64.const 0
     call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#constructor
     br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.get:One|inlined.2
    end
    br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.fromU32|inlined.1
   end
   i32.const 0
   local.get $1
   i64.extend_i32_u
   i64.const 0
   i64.const 0
   i64.const 0
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#constructor
   br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.fromU32|inlined.1
  end
  global.set $~lib/@btc-vision/btc-runtime/runtime/types/SafeMath/SafeMath.CONST_3
  block $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.fromU32|inlined.2 (result i32)
   i32.const 10
   local.set $2
   local.get $2
   i32.const 0
   i32.eq
   if
    block $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.get:Zero|inlined.3 (result i32)
     i32.const 0
     i64.const 0
     i64.const 0
     i64.const 0
     i64.const 0
     call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#constructor
     br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.get:Zero|inlined.3
    end
    br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.fromU32|inlined.2
   end
   local.get $2
   i32.const 1
   i32.eq
   if
    block $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.get:One|inlined.3 (result i32)
     i32.const 0
     i64.const 1
     i64.const 0
     i64.const 0
     i64.const 0
     call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#constructor
     br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.get:One|inlined.3
    end
    br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.fromU32|inlined.2
   end
   i32.const 0
   local.get $2
   i64.extend_i32_u
   i64.const 0
   i64.const 0
   i64.const 0
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#constructor
   br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.fromU32|inlined.2
  end
  global.set $~lib/@btc-vision/btc-runtime/runtime/types/SafeMath/SafeMath.CONST_10
 )
 (func $start:~lib/@btc-vision/btc-runtime/runtime/storage/StoredString
  (local $0 i32)
  call $start:~lib/@btc-vision/btc-runtime/runtime/types/SafeMath
  block $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.fromU32|inlined.3 (result i32)
   global.get $~lib/@btc-vision/btc-runtime/runtime/storage/StoredString/StoredString.DEFAULT_MAX_LENGTH
   local.set $0
   local.get $0
   i32.const 0
   i32.eq
   if
    block $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.get:Zero|inlined.4 (result i32)
     i32.const 0
     i64.const 0
     i64.const 0
     i64.const 0
     i64.const 0
     call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#constructor
     br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.get:Zero|inlined.4
    end
    br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.fromU32|inlined.3
   end
   local.get $0
   i32.const 1
   i32.eq
   if
    block $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.get:One|inlined.4 (result i32)
     i32.const 0
     i64.const 1
     i64.const 0
     i64.const 0
     i64.const 0
     call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#constructor
     br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.get:One|inlined.4
    end
    br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.fromU32|inlined.3
   end
   i32.const 0
   local.get $0
   i64.extend_i32_u
   i64.const 0
   i64.const 0
   i64.const 0
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#constructor
   br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.fromU32|inlined.3
  end
  global.set $~lib/@btc-vision/btc-runtime/runtime/storage/StoredString/StoredString.MAX_LENGTH_U256
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:_nextPointer (param $0 i32) (result i32)
  local.get $0
  i32.load16_u offset=32
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:nextPointer (param $0 i32) (result i32)
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:_nextPointer
  i32.const 65535
  i32.and
  global.get $~lib/builtins/u16.MAX_VALUE
  i32.eq
  if
   i32.const 5456
   i32.const 5536
   i32.const 189
   i32.const 13
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:_nextPointer
  i32.const 1
  i32.add
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#set:_nextPointer
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:_nextPointer
  return
 )
 (func $start:~lib/@btc-vision/btc-runtime/runtime/contracts/ReentrancyGuard
  global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:nextPointer
  i32.const 65535
  i32.and
  global.set $~lib/@btc-vision/btc-runtime/runtime/contracts/ReentrancyGuard/statusPointer
  global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:nextPointer
  i32.const 65535
  i32.and
  global.set $~lib/@btc-vision/btc-runtime/runtime/contracts/ReentrancyGuard/depthPointer
 )
 (func $start:~lib/@btc-vision/btc-runtime/runtime/contracts/OP20
  call $start:~lib/@btc-vision/btc-runtime/runtime/storage/StoredString
  call $start:~lib/@btc-vision/btc-runtime/runtime/contracts/ReentrancyGuard
  global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:nextPointer
  i32.const 65535
  i32.and
  global.set $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/namePointer
  global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:nextPointer
  i32.const 65535
  i32.and
  global.set $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/symbolPointer
  global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:nextPointer
  i32.const 65535
  i32.and
  global.set $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/iconPointer
  global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:nextPointer
  i32.const 65535
  i32.and
  global.set $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/decimalsPointer
  global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:nextPointer
  i32.const 65535
  i32.and
  global.set $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/totalSupplyPointer
  global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:nextPointer
  i32.const 65535
  i32.and
  global.set $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/maxSupplyPointer
  global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:nextPointer
  i32.const 65535
  i32.and
  global.set $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/balanceOfMapPointer
  global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:nextPointer
  i32.const 65535
  i32.and
  global.set $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/allowanceMapPointer
  global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:nextPointer
  i32.const 65535
  i32.and
  global.set $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/nonceMapPointer
 )
 (func $start:~lib/@btc-vision/btc-runtime/runtime/contracts/OP20S
  global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:nextPointer
  i32.const 65535
  i32.and
  global.set $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20S/pegRatePointer
  global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:nextPointer
  i32.const 65535
  i32.and
  global.set $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20S/pegAuthorityPointer
  global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:nextPointer
  i32.const 65535
  i32.and
  global.set $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20S/pegUpdatedAtPointer
  global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:nextPointer
  i32.const 65535
  i32.and
  global.set $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20S/maxStalenessPointer
  global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:nextPointer
  i32.const 65535
  i32.and
  global.set $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20S/pendingAuthorityPointer
 )
 (func $~lib/@btc-vision/as-bignum/assembly/integer/i128/i128#set:lo (param $0 i32) (param $1 i64)
  local.get $0
  local.get $1
  i64.store
 )
 (func $~lib/@btc-vision/as-bignum/assembly/integer/i128/i128#set:hi (param $0 i32) (param $1 i64)
  local.get $0
  local.get $1
  i64.store offset=8
 )
 (func $~lib/@btc-vision/as-bignum/assembly/integer/i128/i128#constructor (param $0 i32) (param $1 i64) (param $2 i64) (result i32)
  local.get $0
  i32.eqz
  if
   i32.const 16
   i32.const 32
   call $~lib/rt/stub/__new
   local.set $0
  end
  local.get $0
  local.get $1
  call $~lib/@btc-vision/as-bignum/assembly/integer/i128/i128#set:lo
  local.get $0
  local.get $2
  call $~lib/@btc-vision/as-bignum/assembly/integer/i128/i128#set:hi
  local.get $0
 )
 (func $start:~lib/@btc-vision/btc-runtime/runtime/types/SafeMathI128
  (local $0 i32)
  (local $1 i32)
  (local $2 i32)
  block $~lib/@btc-vision/as-bignum/assembly/integer/i128/i128.fromI32|inlined.0 (result i32)
   i32.const 0
   local.set $0
   i32.const 0
   local.get $0
   i64.extend_i32_s
   local.get $0
   i32.const 31
   i32.shr_s
   i64.extend_i32_s
   call $~lib/@btc-vision/as-bignum/assembly/integer/i128/i128#constructor
   br $~lib/@btc-vision/as-bignum/assembly/integer/i128/i128.fromI32|inlined.0
  end
  global.set $~lib/@btc-vision/btc-runtime/runtime/types/SafeMathI128/SafeMathI128.ZERO
  block $~lib/@btc-vision/as-bignum/assembly/integer/i128/i128.fromI32|inlined.1 (result i32)
   i32.const 1
   local.set $1
   i32.const 0
   local.get $1
   i64.extend_i32_s
   local.get $1
   i32.const 31
   i32.shr_s
   i64.extend_i32_s
   call $~lib/@btc-vision/as-bignum/assembly/integer/i128/i128#constructor
   br $~lib/@btc-vision/as-bignum/assembly/integer/i128/i128.fromI32|inlined.1
  end
  global.set $~lib/@btc-vision/btc-runtime/runtime/types/SafeMathI128/SafeMathI128.ONE
  block $~lib/@btc-vision/as-bignum/assembly/integer/i128/i128.fromI32|inlined.2 (result i32)
   i32.const -1
   local.set $2
   i32.const 0
   local.get $2
   i64.extend_i32_s
   local.get $2
   i32.const 31
   i32.shr_s
   i64.extend_i32_s
   call $~lib/@btc-vision/as-bignum/assembly/integer/i128/i128#constructor
   br $~lib/@btc-vision/as-bignum/assembly/integer/i128/i128.fromI32|inlined.2
  end
  global.set $~lib/@btc-vision/btc-runtime/runtime/types/SafeMathI128/SafeMathI128.NEG_ONE
  block $~lib/@btc-vision/as-bignum/assembly/integer/i128/i128.get:Min|inlined.0 (result i32)
   i32.const 0
   i64.const 0
   i64.const -9223372036854775808
   call $~lib/@btc-vision/as-bignum/assembly/integer/i128/i128#constructor
   br $~lib/@btc-vision/as-bignum/assembly/integer/i128/i128.get:Min|inlined.0
  end
  global.set $~lib/@btc-vision/btc-runtime/runtime/types/SafeMathI128/SafeMathI128.MIN
  block $~lib/@btc-vision/as-bignum/assembly/integer/i128/i128.get:Max|inlined.0 (result i32)
   i32.const 0
   global.get $~lib/builtins/u64.MAX_VALUE
   i64.const 9223372036854775807
   call $~lib/@btc-vision/as-bignum/assembly/integer/i128/i128#constructor
   br $~lib/@btc-vision/as-bignum/assembly/integer/i128/i128.get:Max|inlined.0
  end
  global.set $~lib/@btc-vision/btc-runtime/runtime/types/SafeMathI128/SafeMathI128.MAX
 )
 (func $start:~lib/@btc-vision/btc-runtime/runtime/secp256k1/ECPoint
  (local $0 i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  block $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.fromBytesLE|inlined.0 (result i32)
   global.get $~lib/@btc-vision/btc-runtime/runtime/secp256k1/ECPoint/P_BYTES
   local.set $3
   local.get $3
   call $~lib/array/Array<u8>#get:length
   i32.const 32
   i32.ne
   if
    i32.const 2672
    i32.const 6032
    i32.const 169
    i32.const 30
    call $~lib/builtins/abort
    unreachable
   end
   local.get $3
   call $~lib/array/Array<u8>#get:dataStart
   local.set $4
   i32.const 0
   local.get $4
   i64.load
   local.get $4
   i64.load offset=8
   local.get $4
   i64.load offset=16
   local.get $4
   i64.load offset=24
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#constructor
   br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.fromBytesLE|inlined.0
  end
  global.set $~lib/@btc-vision/btc-runtime/runtime/secp256k1/ECPoint/P
  block $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.fromBytesLE|inlined.1 (result i32)
   global.get $~lib/@btc-vision/btc-runtime/runtime/secp256k1/ECPoint/GX_BYTES
   local.set $5
   local.get $5
   call $~lib/array/Array<u8>#get:length
   i32.const 32
   i32.ne
   if
    i32.const 2672
    i32.const 6032
    i32.const 169
    i32.const 30
    call $~lib/builtins/abort
    unreachable
   end
   local.get $5
   call $~lib/array/Array<u8>#get:dataStart
   local.set $6
   i32.const 0
   local.get $6
   i64.load
   local.get $6
   i64.load offset=8
   local.get $6
   i64.load offset=16
   local.get $6
   i64.load offset=24
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#constructor
   br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.fromBytesLE|inlined.1
  end
  global.set $~lib/@btc-vision/btc-runtime/runtime/secp256k1/ECPoint/GX
  block $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.fromBytesLE|inlined.2 (result i32)
   global.get $~lib/@btc-vision/btc-runtime/runtime/secp256k1/ECPoint/GY_BYTES
   local.set $7
   local.get $7
   call $~lib/array/Array<u8>#get:length
   i32.const 32
   i32.ne
   if
    i32.const 2672
    i32.const 6032
    i32.const 169
    i32.const 30
    call $~lib/builtins/abort
    unreachable
   end
   local.get $7
   call $~lib/array/Array<u8>#get:dataStart
   local.set $8
   i32.const 0
   local.get $8
   i64.load
   local.get $8
   i64.load offset=8
   local.get $8
   i64.load offset=16
   local.get $8
   i64.load offset=24
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#constructor
   br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.fromBytesLE|inlined.2
  end
  global.set $~lib/@btc-vision/btc-runtime/runtime/secp256k1/ECPoint/GY
 )
 (func $start:~lib/@btc-vision/btc-runtime/runtime/contracts/OP721
  global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:nextPointer
  i32.const 65535
  i32.and
  global.set $~lib/@btc-vision/btc-runtime/runtime/contracts/OP721/stringPointer
  global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:nextPointer
  i32.const 65535
  i32.and
  global.set $~lib/@btc-vision/btc-runtime/runtime/contracts/OP721/totalSupplyPointer
  global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:nextPointer
  i32.const 65535
  i32.and
  global.set $~lib/@btc-vision/btc-runtime/runtime/contracts/OP721/maxSupplyPointer
  global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:nextPointer
  i32.const 65535
  i32.and
  global.set $~lib/@btc-vision/btc-runtime/runtime/contracts/OP721/ownerOfMapPointer
  global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:nextPointer
  i32.const 65535
  i32.and
  global.set $~lib/@btc-vision/btc-runtime/runtime/contracts/OP721/tokenApprovalMapPointer
  global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:nextPointer
  i32.const 65535
  i32.and
  global.set $~lib/@btc-vision/btc-runtime/runtime/contracts/OP721/operatorApprovalMapPointer
  global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:nextPointer
  i32.const 65535
  i32.and
  global.set $~lib/@btc-vision/btc-runtime/runtime/contracts/OP721/balanceOfMapPointer
  global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:nextPointer
  i32.const 65535
  i32.and
  global.set $~lib/@btc-vision/btc-runtime/runtime/contracts/OP721/tokenURIMapPointer
  global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:nextPointer
  i32.const 65535
  i32.and
  global.set $~lib/@btc-vision/btc-runtime/runtime/contracts/OP721/nextTokenIdPointer
  global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:nextPointer
  i32.const 65535
  i32.and
  global.set $~lib/@btc-vision/btc-runtime/runtime/contracts/OP721/ownerTokensMapPointer
  global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:nextPointer
  i32.const 65535
  i32.and
  global.set $~lib/@btc-vision/btc-runtime/runtime/contracts/OP721/tokenIndexMapPointer
  global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:nextPointer
  i32.const 65535
  i32.and
  global.set $~lib/@btc-vision/btc-runtime/runtime/contracts/OP721/initializedPointer
  global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:nextPointer
  i32.const 65535
  i32.and
  global.set $~lib/@btc-vision/btc-runtime/runtime/contracts/OP721/tokenURICounterPointer
  global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:nextPointer
  i32.const 65535
  i32.and
  global.set $~lib/@btc-vision/btc-runtime/runtime/contracts/OP721/approveNonceMapPointer
 )
 (func $start:~lib/@btc-vision/btc-runtime/runtime/contracts/Upgradeable
  global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:nextPointer
  i32.const 65535
  i32.and
  global.set $~lib/@btc-vision/btc-runtime/runtime/contracts/Upgradeable/pendingUpgradeAddressPointer
  global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:nextPointer
  i32.const 65535
  i32.and
  global.set $~lib/@btc-vision/btc-runtime/runtime/contracts/Upgradeable/pendingUpgradeBlockPointer
 )
 (func $start:~lib/@btc-vision/btc-runtime/runtime/index
  call $start:~lib/@btc-vision/btc-runtime/runtime/env/index
  call $start:~lib/@btc-vision/btc-runtime/runtime/contracts/OP20
  call $start:~lib/@btc-vision/btc-runtime/runtime/contracts/OP20S
  call $start:~lib/@btc-vision/btc-runtime/runtime/types/SafeMathI128
  call $start:~lib/@btc-vision/btc-runtime/runtime/secp256k1/ECPoint
  call $start:~lib/@btc-vision/btc-runtime/runtime/contracts/OP721
  call $start:~lib/@btc-vision/btc-runtime/runtime/contracts/Upgradeable
 )
 (func $start:src/wrapped/husdt/HUSDT
  global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:nextPointer
  i32.const 65535
  i32.and
  global.set $src/wrapped/husdt/HUSDT/bridgeAuthorityPointer
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP_NET/OP_NET#set:_plugins (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store
  local.get $0
  local.get $1
  i32.const 0
  call $~lib/rt/stub/__link
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP_NET/OP_NET#constructor (param $0 i32) (result i32)
  (local $1 i32)
  local.get $0
  i32.eqz
  if
   i32.const 4
   i32.const 19
   call $~lib/rt/stub/__new
   local.set $0
  end
  local.get $0
  call $~lib/object/Object#constructor
  local.set $0
  local.get $0
  i32.const 0
  i32.const 2
  i32.const 22
  i32.const 7504
  call $~lib/rt/__newArray
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP_NET/OP_NET#set:_plugins
  local.get $0
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/storage/StoredBoolean/StoredBoolean#set:pointerBuffer (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store
  local.get $0
  local.get $1
  i32.const 0
  call $~lib/rt/stub/__link
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/storage/StoredBoolean/StoredBoolean#set:_value (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=8
  local.get $0
  local.get $1
  i32.const 0
  call $~lib/rt/stub/__link
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/storage/StoredBoolean/StoredBoolean#set:pointer (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store16 offset=4
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/storage/StoredBoolean/StoredBoolean#constructor (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  (local $3 i32)
  (local $4 i32)
  local.get $0
  i32.eqz
  if
   i32.const 12
   i32.const 37
   call $~lib/rt/stub/__new
   local.set $0
  end
  local.get $0
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredBoolean/StoredBoolean#set:pointer
  local.get $0
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredBoolean/StoredBoolean#set:pointerBuffer
  local.get $0
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredBoolean/StoredBoolean#set:_value
  block $~lib/@btc-vision/btc-runtime/runtime/math/bytes/GET_EMPTY_BUFFER|inlined.0 (result i32)
   i32.const 0
   i32.const 32
   call $~lib/typedarray/Uint8Array#constructor
   br $~lib/@btc-vision/btc-runtime/runtime/math/bytes/GET_EMPTY_BUFFER|inlined.0
  end
  local.set $3
  local.get $3
  i32.const 0
  local.get $1
  i32.const 255
  i32.and
  call $~lib/typedarray/Uint8Array#__set
  local.get $3
  i32.const 1
  local.get $1
  i32.const 65535
  i32.and
  i32.const 8
  i32.const 15
  i32.and
  i32.shr_u
  i32.const 255
  i32.and
  call $~lib/typedarray/Uint8Array#__set
  local.get $0
  local.get $3
  call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredBoolean/StoredBoolean#set:pointerBuffer
  block $~lib/@btc-vision/btc-runtime/runtime/math/bytes/GET_EMPTY_BUFFER|inlined.1 (result i32)
   i32.const 0
   i32.const 32
   call $~lib/typedarray/Uint8Array#constructor
   br $~lib/@btc-vision/btc-runtime/runtime/math/bytes/GET_EMPTY_BUFFER|inlined.1
  end
  local.set $4
  local.get $2
  if
   local.get $4
   i32.const 0
   i32.const 1
   call $~lib/typedarray/Uint8Array#__set
  end
  local.get $0
  local.get $4
  call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredBoolean/StoredBoolean#set:_value
  local.get $0
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/ReentrancyGuard/ReentrancyGuard#set:_locked (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=4
  local.get $0
  local.get $1
  i32.const 0
  call $~lib/rt/stub/__link
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/math/abi/encodePointer (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32) (result i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  (local $10 i32)
  (local $11 i32)
  block $~lib/@btc-vision/btc-runtime/runtime/math/abi/ensureAtLeast30Bytes|inlined.0 (result i32)
   local.get $1
   local.set $4
   local.get $4
   call $~lib/typedarray/Uint8Array#get:length
   i32.const 30
   i32.ge_s
   if
    local.get $4
    br $~lib/@btc-vision/btc-runtime/runtime/math/abi/ensureAtLeast30Bytes|inlined.0
   end
   i32.const 0
   i32.const 30
   call $~lib/typedarray/Uint8Array#constructor
   local.set $5
   i32.const 0
   local.set $6
   loop $for-loop|0
    local.get $6
    local.get $4
    call $~lib/typedarray/Uint8Array#get:length
    i32.lt_s
    if
     local.get $5
     local.get $6
     local.get $4
     local.get $6
     call $~lib/typedarray/Uint8Array#__get
     call $~lib/typedarray/Uint8Array#__set
     local.get $6
     i32.const 1
     i32.add
     local.set $6
     br $for-loop|0
    end
   end
   local.get $5
   br $~lib/@btc-vision/btc-runtime/runtime/math/abi/ensureAtLeast30Bytes|inlined.0
  end
  local.set $7
  local.get $2
  if
   local.get $7
   call $~lib/typedarray/Uint8Array#get:length
   i32.const 30
   i32.eq
   i32.eqz
   if
    local.get $7
    call $~lib/typedarray/Uint8Array#get:length
    i32.const 10
    call $~lib/number/I32#toString
    local.set $8
    local.get $3
    local.set $9
    i32.const 7776
    i32.const 1
    local.get $8
    call $~lib/staticarray/StaticArray<~lib/string/String>#__uset
    i32.const 7776
    i32.const 3
    local.get $9
    call $~lib/staticarray/StaticArray<~lib/string/String>#__uset
    i32.const 7776
    i32.const 96
    call $~lib/staticarray/StaticArray<~lib/string/String>#join
    i32.const 7824
    i32.const 101
    i32.const 9
    call $~lib/builtins/abort
    unreachable
   end
  end
  i32.const 0
  i32.const 32
  call $~lib/typedarray/Uint8Array#constructor
  local.set $10
  local.get $10
  i32.const 0
  local.get $0
  i32.const 65535
  i32.and
  i32.const 8
  i32.const 15
  i32.and
  i32.shr_u
  i32.const 255
  i32.and
  call $~lib/typedarray/Uint8Array#__set
  local.get $10
  i32.const 1
  local.get $0
  i32.const 255
  i32.and
  call $~lib/typedarray/Uint8Array#__set
  i32.const 0
  local.set $11
  loop $for-loop|1
   local.get $11
   i32.const 30
   i32.lt_s
   if
    local.get $10
    local.get $11
    i32.const 2
    i32.add
    local.get $7
    local.get $11
    call $~lib/typedarray/Uint8Array#__get
    call $~lib/typedarray/Uint8Array#__set
    local.get $11
    i32.const 1
    i32.add
    local.set $11
    br $for-loop|1
   end
  end
  local.get $10
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/storage/StoredU256/StoredU256#set:pointerBuffer (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store
  local.get $0
  local.get $1
  i32.const 0
  call $~lib/rt/stub/__link
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/storage/StoredU256/StoredU256#set:pointer (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store16 offset=4
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/storage/StoredU256/StoredU256#set:subPointer (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=8
  local.get $0
  local.get $1
  i32.const 0
  call $~lib/rt/stub/__link
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/storage/StoredU256/StoredU256#set:_value (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=12
  local.get $0
  local.get $1
  i32.const 0
  call $~lib/rt/stub/__link
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/storage/StoredU256/StoredU256#constructor (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  local.get $0
  i32.eqz
  if
   i32.const 16
   i32.const 38
   call $~lib/rt/stub/__new
   local.set $0
  end
  local.get $0
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredU256/StoredU256#set:pointer
  local.get $0
  local.get $2
  call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredU256/StoredU256#set:subPointer
  local.get $0
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredU256/StoredU256#set:pointerBuffer
  local.get $0
  block $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.get:Zero|inlined.5 (result i32)
   i32.const 0
   i64.const 0
   i64.const 0
   i64.const 0
   i64.const 0
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#constructor
   br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.get:Zero|inlined.5
  end
  call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredU256/StoredU256#set:_value
  local.get $0
  local.get $1
  local.get $2
  i32.const 1
  i32.const 7536
  call $~lib/@btc-vision/btc-runtime/runtime/math/abi/encodePointer
  call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredU256/StoredU256#set:pointerBuffer
  local.get $0
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/ReentrancyGuard/ReentrancyGuard#set:_reentrancyDepth (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=8
  local.get $0
  local.get $1
  i32.const 0
  call $~lib/rt/stub/__link
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/ReentrancyGuard/ReentrancyGuard#set:reentrancyLevel (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=12
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/ReentrancyGuard/ReentrancyGuard#constructor (param $0 i32) (result i32)
  local.get $0
  i32.eqz
  if
   i32.const 16
   i32.const 36
   call $~lib/rt/stub/__new
   local.set $0
  end
  local.get $0
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/ReentrancyGuard/ReentrancyGuard#set:_locked
  local.get $0
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/ReentrancyGuard/ReentrancyGuard#set:_reentrancyDepth
  local.get $0
  global.get $~lib/@btc-vision/btc-runtime/runtime/contracts/ReentrancyGuard/ReentrancyLevel.STANDARD
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/ReentrancyGuard/ReentrancyGuard#set:reentrancyLevel
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP_NET/OP_NET#constructor
  local.set $0
  local.get $0
  i32.const 0
  global.get $~lib/@btc-vision/btc-runtime/runtime/contracts/ReentrancyGuard/statusPointer
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredBoolean/StoredBoolean#constructor
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/ReentrancyGuard/ReentrancyGuard#set:_locked
  local.get $0
  i32.const 0
  global.get $~lib/@btc-vision/btc-runtime/runtime/contracts/ReentrancyGuard/depthPointer
  global.get $~lib/@btc-vision/btc-runtime/runtime/math/bytes/EMPTY_POINTER
  call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredU256/StoredU256#constructor
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/ReentrancyGuard/ReentrancyGuard#set:_reentrancyDepth
  local.get $0
 )
 (func $"~lib/@btc-vision/btc-runtime/runtime/generic/Map/Map<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address,~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#set:_keys" (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store
  local.get $0
  local.get $1
  i32.const 0
  call $~lib/rt/stub/__link
 )
 (func $"~lib/@btc-vision/btc-runtime/runtime/generic/Map/Map<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address,~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#set:_values" (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=4
  local.get $0
  local.get $1
  i32.const 0
  call $~lib/rt/stub/__link
 )
 (func $"~lib/@btc-vision/btc-runtime/runtime/generic/Map/Map<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address,~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#set:_lastIndex" (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=8
 )
 (func $"~lib/@btc-vision/btc-runtime/runtime/generic/Map/Map<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address,~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#constructor" (param $0 i32) (result i32)
  (local $1 i32)
  (local $2 i32)
  local.get $0
  i32.eqz
  if
   i32.const 12
   i32.const 42
   call $~lib/rt/stub/__new
   local.set $0
  end
  local.get $0
  call $~lib/object/Object#constructor
  local.set $0
  local.get $0
  i32.const 0
  i32.const 2
  i32.const 44
  i32.const 7952
  call $~lib/rt/__newArray
  call $"~lib/@btc-vision/btc-runtime/runtime/generic/Map/Map<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address,~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#set:_keys"
  local.get $0
  i32.const 0
  i32.const 2
  i32.const 45
  i32.const 7984
  call $~lib/rt/__newArray
  call $"~lib/@btc-vision/btc-runtime/runtime/generic/Map/Map<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address,~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#set:_values"
  local.get $0
  i32.const -1
  call $"~lib/@btc-vision/btc-runtime/runtime/generic/Map/Map<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address,~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#set:_lastIndex"
  local.get $0
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/memory/MapOfMap/MapOfMap<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>#set:pointer (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store16 offset=12
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/memory/MapOfMap/MapOfMap<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>#constructor (param $0 i32) (param $1 i32) (result i32)
  local.get $0
  i32.eqz
  if
   i32.const 14
   i32.const 40
   call $~lib/rt/stub/__new
   local.set $0
  end
  local.get $0
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/memory/MapOfMap/MapOfMap<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>#set:pointer
  local.get $0
  call $"~lib/@btc-vision/btc-runtime/runtime/generic/Map/Map<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address,~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#constructor"
  local.set $0
  local.get $0
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/memory/MapOfMap/MapOfMap<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>#set:pointer
  local.get $0
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#set:allowanceMap (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=20
  local.get $0
  local.get $1
  i32.const 0
  call $~lib/rt/stub/__link
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/memory/AddressMemoryMap/AddressMemoryMap#set:pointer (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store16
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/memory/AddressMemoryMap/AddressMemoryMap#constructor (param $0 i32) (param $1 i32) (result i32)
  local.get $0
  i32.eqz
  if
   i32.const 2
   i32.const 46
   call $~lib/rt/stub/__new
   local.set $0
  end
  local.get $0
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/memory/AddressMemoryMap/AddressMemoryMap#set:pointer
  local.get $0
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/memory/AddressMemoryMap/AddressMemoryMap#set:pointer
  local.get $0
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#set:balanceOfMap (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=24
  local.get $0
  local.get $1
  i32.const 0
  call $~lib/rt/stub/__link
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#set:_nonceMap (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=48
  local.get $0
  local.get $1
  i32.const 0
  call $~lib/rt/stub/__link
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#set:_totalSupply (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=16
  local.get $0
  local.get $1
  i32.const 0
  call $~lib/rt/stub/__link
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#set:_maxSupply (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=28
  local.get $0
  local.get $1
  i32.const 0
  call $~lib/rt/stub/__link
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#set:_decimals (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=32
  local.get $0
  local.get $1
  i32.const 0
  call $~lib/rt/stub/__link
 )
 (func $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo1 (param $0 i32) (result i64)
  local.get $0
  i64.load
 )
 (func $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo2 (param $0 i32) (result i64)
  local.get $0
  i64.load offset=8
 )
 (func $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi1 (param $0 i32) (result i64)
  local.get $0
  i64.load offset=16
 )
 (func $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi2 (param $0 i32) (result i64)
  local.get $0
  i64.load offset=24
 )
 (func $~lib/array/Array<u64>#get:length_ (param $0 i32) (result i32)
  local.get $0
  i32.load offset=12
 )
 (func $~lib/array/Array<u64>#set:length_ (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=12
 )
 (func $~lib/array/Array<u64>#get:dataStart (param $0 i32) (result i32)
  local.get $0
  i32.load offset=4
 )
 (func $~lib/array/Array<u64>#__set (param $0 i32) (param $1 i32) (param $2 i64)
  local.get $1
  local.get $0
  call $~lib/array/Array<u64>#get:length_
  i32.ge_u
  if
   local.get $1
   i32.const 0
   i32.lt_s
   if
    i32.const 3056
    i32.const 4336
    i32.const 130
    i32.const 22
    call $~lib/builtins/abort
    unreachable
   end
   local.get $0
   local.get $1
   i32.const 1
   i32.add
   i32.const 3
   i32.const 1
   call $~lib/array/ensureCapacity
   local.get $0
   local.get $1
   i32.const 1
   i32.add
   call $~lib/array/Array<u64>#set:length_
  end
  local.get $0
  call $~lib/array/Array<u64>#get:dataStart
  local.get $1
  i32.const 3
  i32.shl
  i32.add
  local.get $2
  i64.store
  i32.const 0
  drop
 )
 (func $~lib/array/Array<u64>#__get (param $0 i32) (param $1 i32) (result i64)
  (local $2 i64)
  local.get $1
  local.get $0
  call $~lib/array/Array<u64>#get:length_
  i32.ge_u
  if
   i32.const 3056
   i32.const 4336
   i32.const 114
   i32.const 42
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  call $~lib/array/Array<u64>#get:dataStart
  local.get $1
  i32.const 3
  i32.shl
  i32.add
  i64.load
  local.set $2
  i32.const 0
  drop
  local.get $2
  return
 )
 (func $~lib/@btc-vision/as-bignum/assembly/globals/__umulq64 (param $0 i64) (param $1 i64) (result i64)
  (local $2 i64)
  (local $3 i64)
  (local $4 i64)
  (local $5 i64)
  (local $6 i64)
  local.get $0
  i64.const 4294967295
  i64.and
  local.set $2
  local.get $0
  i64.const 32
  i64.shr_u
  local.set $0
  local.get $1
  i64.const 4294967295
  i64.and
  local.set $3
  local.get $1
  i64.const 32
  i64.shr_u
  local.set $1
  local.get $2
  local.get $3
  i64.mul
  local.set $4
  local.get $4
  i64.const 4294967295
  i64.and
  local.set $5
  local.get $0
  local.get $3
  i64.mul
  local.get $4
  i64.const 32
  i64.shr_u
  i64.add
  local.set $4
  local.get $4
  i64.const 32
  i64.shr_u
  local.set $6
  local.get $2
  local.get $1
  i64.mul
  local.get $4
  i64.const 4294967295
  i64.and
  i64.add
  local.set $4
  local.get $0
  local.get $1
  i64.mul
  local.get $6
  i64.add
  local.get $4
  i64.const 32
  i64.shr_u
  i64.add
  global.set $~lib/@btc-vision/as-bignum/assembly/globals/__res128_hi
  local.get $4
  i64.const 32
  i64.shl
  local.get $5
  i64.or
  return
 )
 (func $~lib/@btc-vision/as-bignum/assembly/integer/u128/u128#get:lo (param $0 i32) (result i64)
  local.get $0
  i64.load
 )
 (func $~lib/@btc-vision/as-bignum/assembly/integer/u128/u128#get:hi (param $0 i32) (result i64)
  local.get $0
  i64.load offset=8
 )
 (func $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#clone (param $0 i32) (result i32)
  i32.const 0
  local.get $0
  call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo1
  local.get $0
  call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo2
  local.get $0
  call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi1
  local.get $0
  call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi2
  call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#constructor
  return
 )
 (func $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.shl (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i64)
  (local $6 i64)
  (local $7 i64)
  (local $8 i64)
  (local $9 i64)
  (local $10 i64)
  (local $11 i64)
  (local $12 i64)
  local.get $1
  i32.const 0
  i32.le_s
  if
   local.get $1
   i32.const 0
   i32.eq
   if (result i32)
    local.get $0
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#clone
   else
    block $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.get:Zero|inlined.8 (result i32)
     i32.const 0
     i64.const 0
     i64.const 0
     i64.const 0
     i64.const 0
     call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#constructor
     br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.get:Zero|inlined.8
    end
   end
   return
  end
  local.get $1
  i32.const 256
  i32.ge_s
  if
   block $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.get:Zero|inlined.9 (result i32)
    i32.const 0
    i64.const 0
    i64.const 0
    i64.const 0
    i64.const 0
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#constructor
    br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.get:Zero|inlined.9
   end
   return
  end
  local.get $1
  i32.const 255
  i32.and
  local.set $1
  local.get $1
  i32.const 64
  i32.div_s
  i32.const 0
  i32.or
  local.set $2
  local.get $1
  i32.const 64
  i32.rem_s
  local.set $3
  i32.const 64
  local.get $3
  i32.sub
  local.set $4
  i64.const 0
  local.set $5
  i64.const 0
  local.set $6
  i64.const 0
  local.set $7
  i64.const 0
  local.set $8
  local.get $0
  call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo1
  local.set $9
  local.get $0
  call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo2
  local.set $10
  local.get $0
  call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi1
  local.set $11
  local.get $0
  call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi2
  local.set $12
  local.get $2
  i32.const 0
  i32.eq
  if
   local.get $9
   local.get $3
   i64.extend_i32_s
   i64.shl
   local.set $5
   local.get $10
   local.get $3
   i64.extend_i32_s
   i64.shl
   local.get $3
   i32.const 0
   i32.eq
   if (result i64)
    i64.const 0
   else
    local.get $9
    local.get $4
    i64.extend_i32_s
    i64.shr_u
   end
   i64.or
   local.set $6
   local.get $11
   local.get $3
   i64.extend_i32_s
   i64.shl
   local.get $3
   i32.const 0
   i32.eq
   if (result i64)
    i64.const 0
   else
    local.get $10
    local.get $4
    i64.extend_i32_s
    i64.shr_u
   end
   i64.or
   local.set $7
   local.get $12
   local.get $3
   i64.extend_i32_s
   i64.shl
   local.get $3
   i32.const 0
   i32.eq
   if (result i64)
    i64.const 0
   else
    local.get $11
    local.get $4
    i64.extend_i32_s
    i64.shr_u
   end
   i64.or
   local.set $8
  else
   local.get $2
   i32.const 1
   i32.eq
   if
    local.get $9
    local.get $3
    i64.extend_i32_s
    i64.shl
    local.set $6
    local.get $10
    local.get $3
    i64.extend_i32_s
    i64.shl
    local.get $3
    i32.const 0
    i32.eq
    if (result i64)
     i64.const 0
    else
     local.get $9
     local.get $4
     i64.extend_i32_s
     i64.shr_u
    end
    i64.or
    local.set $7
    local.get $11
    local.get $3
    i64.extend_i32_s
    i64.shl
    local.get $3
    i32.const 0
    i32.eq
    if (result i64)
     i64.const 0
    else
     local.get $10
     local.get $4
     i64.extend_i32_s
     i64.shr_u
    end
    i64.or
    local.set $8
   else
    local.get $2
    i32.const 2
    i32.eq
    if
     local.get $9
     local.get $3
     i64.extend_i32_s
     i64.shl
     local.set $7
     local.get $10
     local.get $3
     i64.extend_i32_s
     i64.shl
     local.get $3
     i32.const 0
     i32.eq
     if (result i64)
      i64.const 0
     else
      local.get $9
      local.get $4
      i64.extend_i32_s
      i64.shr_u
     end
     i64.or
     local.set $8
    else
     local.get $2
     i32.const 3
     i32.eq
     if
      local.get $9
      local.get $3
      i64.extend_i32_s
      i64.shl
      local.set $8
     end
    end
   end
  end
  i32.const 0
  local.get $5
  local.get $6
  local.get $7
  local.get $8
  call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#constructor
  return
 )
 (func $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.add (param $0 i32) (param $1 i32) (result i32)
  (local $2 i64)
  (local $3 i64)
  (local $4 i64)
  (local $5 i64)
  (local $6 i32)
  (local $7 i64)
  (local $8 i64)
  (local $9 i64)
  (local $10 i64)
  (local $11 i64)
  (local $12 i64)
  (local $13 i64)
  (local $14 i32)
  (local $15 i64)
  (local $16 i64)
  (local $17 i64)
  (local $18 i64)
  (local $19 i64)
  (local $20 i64)
  (local $21 i64)
  (local $22 i32)
  (local $23 i64)
  (local $24 i64)
  (local $25 i64)
  (local $26 i64)
  (local $27 i64)
  (local $28 i64)
  (local $29 i64)
  (local $30 i32)
  (local $31 i64)
  (local $32 i64)
  block $~lib/@btc-vision/as-bignum/assembly/globals/add64Local|inlined.0 (result i64)
   local.get $0
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo1
   local.set $2
   local.get $1
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo1
   local.set $3
   i64.const 0
   local.set $4
   local.get $2
   local.get $4
   i64.add
   local.set $5
   local.get $5
   local.get $2
   i64.lt_u
   if (result i32)
    i32.const 1
   else
    i32.const 0
   end
   local.set $6
   local.get $5
   local.get $3
   i64.add
   local.set $7
   local.get $6
   local.get $7
   local.get $5
   i64.lt_u
   if (result i32)
    i32.const 1
   else
    i32.const 0
   end
   i32.add
   local.set $6
   local.get $6
   i64.extend_i32_s
   global.set $~lib/@btc-vision/as-bignum/assembly/globals/__u256carry
   local.get $7
   br $~lib/@btc-vision/as-bignum/assembly/globals/add64Local|inlined.0
  end
  local.set $8
  global.get $~lib/@btc-vision/as-bignum/assembly/globals/__u256carry
  local.set $9
  block $~lib/@btc-vision/as-bignum/assembly/globals/add64Local|inlined.1 (result i64)
   local.get $0
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo2
   local.set $10
   local.get $1
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo2
   local.set $11
   local.get $9
   local.set $12
   local.get $10
   local.get $12
   i64.add
   local.set $13
   local.get $13
   local.get $10
   i64.lt_u
   if (result i32)
    i32.const 1
   else
    i32.const 0
   end
   local.set $14
   local.get $13
   local.get $11
   i64.add
   local.set $15
   local.get $14
   local.get $15
   local.get $13
   i64.lt_u
   if (result i32)
    i32.const 1
   else
    i32.const 0
   end
   i32.add
   local.set $14
   local.get $14
   i64.extend_i32_s
   global.set $~lib/@btc-vision/as-bignum/assembly/globals/__u256carry
   local.get $15
   br $~lib/@btc-vision/as-bignum/assembly/globals/add64Local|inlined.1
  end
  local.set $16
  global.get $~lib/@btc-vision/as-bignum/assembly/globals/__u256carry
  local.set $17
  block $~lib/@btc-vision/as-bignum/assembly/globals/add64Local|inlined.2 (result i64)
   local.get $0
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi1
   local.set $18
   local.get $1
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi1
   local.set $19
   local.get $17
   local.set $20
   local.get $18
   local.get $20
   i64.add
   local.set $21
   local.get $21
   local.get $18
   i64.lt_u
   if (result i32)
    i32.const 1
   else
    i32.const 0
   end
   local.set $22
   local.get $21
   local.get $19
   i64.add
   local.set $23
   local.get $22
   local.get $23
   local.get $21
   i64.lt_u
   if (result i32)
    i32.const 1
   else
    i32.const 0
   end
   i32.add
   local.set $22
   local.get $22
   i64.extend_i32_s
   global.set $~lib/@btc-vision/as-bignum/assembly/globals/__u256carry
   local.get $23
   br $~lib/@btc-vision/as-bignum/assembly/globals/add64Local|inlined.2
  end
  local.set $24
  global.get $~lib/@btc-vision/as-bignum/assembly/globals/__u256carry
  local.set $25
  block $~lib/@btc-vision/as-bignum/assembly/globals/add64Local|inlined.3 (result i64)
   local.get $0
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi2
   local.set $26
   local.get $1
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi2
   local.set $27
   local.get $25
   local.set $28
   local.get $26
   local.get $28
   i64.add
   local.set $29
   local.get $29
   local.get $26
   i64.lt_u
   if (result i32)
    i32.const 1
   else
    i32.const 0
   end
   local.set $30
   local.get $29
   local.get $27
   i64.add
   local.set $31
   local.get $30
   local.get $31
   local.get $29
   i64.lt_u
   if (result i32)
    i32.const 1
   else
    i32.const 0
   end
   i32.add
   local.set $30
   local.get $30
   i64.extend_i32_s
   global.set $~lib/@btc-vision/as-bignum/assembly/globals/__u256carry
   local.get $31
   br $~lib/@btc-vision/as-bignum/assembly/globals/add64Local|inlined.3
  end
  local.set $32
  i32.const 0
  local.get $8
  local.get $16
  local.get $24
  local.get $32
  call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#constructor
  return
 )
 (func $~lib/@btc-vision/as-bignum/assembly/globals/__mul256 (param $0 i64) (param $1 i64) (param $2 i64) (param $3 i64) (param $4 i64) (param $5 i64) (param $6 i64) (param $7 i64) (result i32)
  (local $8 i32)
  (local $9 i32)
  (local $10 i32)
  (local $11 i32)
  (local $12 i32)
  (local $13 i32)
  (local $14 i32)
  (local $15 i32)
  (local $16 i64)
  (local $17 i64)
  (local $18 i64)
  (local $19 i64)
  (local $20 i32)
  (local $21 i32)
  i32.const 0
  i64.const 0
  i64.const 0
  i64.const 0
  i64.const 0
  call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#constructor
  local.set $8
  i32.const 4
  i32.const 3
  i32.const 50
  i32.const 0
  call $~lib/rt/__newArray
  local.set $9
  local.get $9
  i32.const 0
  local.get $0
  call $~lib/array/Array<u64>#__set
  local.get $9
  i32.const 1
  local.get $1
  call $~lib/array/Array<u64>#__set
  local.get $9
  i32.const 2
  local.get $2
  call $~lib/array/Array<u64>#__set
  local.get $9
  i32.const 3
  local.get $3
  call $~lib/array/Array<u64>#__set
  local.get $9
  local.set $10
  i32.const 4
  i32.const 3
  i32.const 50
  i32.const 0
  call $~lib/rt/__newArray
  local.set $11
  local.get $11
  i32.const 0
  local.get $4
  call $~lib/array/Array<u64>#__set
  local.get $11
  i32.const 1
  local.get $5
  call $~lib/array/Array<u64>#__set
  local.get $11
  i32.const 2
  local.get $6
  call $~lib/array/Array<u64>#__set
  local.get $11
  i32.const 3
  local.get $7
  call $~lib/array/Array<u64>#__set
  local.get $11
  local.set $12
  i32.const 0
  local.set $13
  loop $for-loop|0
   local.get $13
   i32.const 4
   i32.lt_s
   if
    i32.const 0
    local.set $14
    loop $for-loop|1
     local.get $14
     i32.const 4
     i32.lt_s
     if
      block $for-continue|1
       local.get $13
       local.get $14
       i32.add
       i32.const 6
       i32.shl
       local.set $15
       local.get $15
       i32.const 256
       i32.ge_s
       if
        br $for-continue|1
       end
       block $~lib/@btc-vision/as-bignum/assembly/globals/mul64To128|inlined.0 (result i32)
        local.get $10
        local.get $13
        call $~lib/array/Array<u64>#__get
        local.set $16
        local.get $12
        local.get $14
        call $~lib/array/Array<u64>#__get
        local.set $17
        local.get $16
        local.get $17
        call $~lib/@btc-vision/as-bignum/assembly/globals/__umulq64
        local.set $18
        global.get $~lib/@btc-vision/as-bignum/assembly/globals/__res128_hi
        local.set $19
        i32.const 0
        local.get $18
        local.get $19
        call $~lib/@btc-vision/as-bignum/assembly/integer/u128/u128#constructor
        br $~lib/@btc-vision/as-bignum/assembly/globals/mul64To128|inlined.0
       end
       local.set $20
       i32.const 0
       local.get $20
       call $~lib/@btc-vision/as-bignum/assembly/integer/u128/u128#get:lo
       local.get $20
       call $~lib/@btc-vision/as-bignum/assembly/integer/u128/u128#get:hi
       i64.const 0
       i64.const 0
       call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#constructor
       local.set $21
       local.get $15
       i32.const 0
       i32.ne
       if
        local.get $21
        local.get $15
        call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.shl
        local.set $21
       end
       local.get $8
       local.get $21
       call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.add
       local.set $8
      end
      local.get $14
      i32.const 1
      i32.add
      local.set $14
      br $for-loop|1
     end
    end
    local.get $13
    i32.const 1
    i32.add
    local.set $13
    br $for-loop|0
   end
  end
  local.get $8
  return
 )
 (func $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.lt (param $0 i32) (param $1 i32) (result i32)
  local.get $0
  call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi2
  local.get $1
  call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi2
  i64.ne
  if
   local.get $0
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi2
   local.get $1
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi2
   i64.lt_u
   return
  end
  local.get $0
  call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi1
  local.get $1
  call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi1
  i64.ne
  if
   local.get $0
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi1
   local.get $1
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi1
   i64.lt_u
   return
  end
  local.get $0
  call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo2
  local.get $1
  call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo2
  i64.ne
  if
   local.get $0
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo2
   local.get $1
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo2
   i64.lt_u
   return
  end
  local.get $0
  call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo1
  local.get $1
  call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo1
  i64.lt_u
  return
 )
 (func $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.div (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  (local $10 i32)
  (local $11 i32)
  (local $12 i32)
  (local $13 i32)
  (local $14 i32)
  (local $15 i32)
  (local $16 i32)
  (local $17 i64)
  (local $18 i64)
  (local $19 i64)
  (local $20 i64)
  (local $21 i32)
  (local $22 i64)
  (local $23 i64)
  (local $24 i64)
  (local $25 i64)
  (local $26 i64)
  (local $27 i64)
  (local $28 i64)
  (local $29 i32)
  (local $30 i64)
  (local $31 i64)
  (local $32 i64)
  (local $33 i64)
  (local $34 i64)
  (local $35 i64)
  (local $36 i64)
  (local $37 i32)
  (local $38 i64)
  (local $39 i64)
  (local $40 i64)
  (local $41 i64)
  (local $42 i64)
  (local $43 i64)
  (local $44 i64)
  (local $45 i32)
  (local $46 i64)
  (local $47 i64)
  (local $48 i32)
  (local $49 i32)
  (local $50 i32)
  (local $51 i32)
  (local $52 i64)
  (local $53 i32)
  block $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#isZero|inlined.2 (result i32)
   local.get $1
   local.set $2
   local.get $2
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo1
   local.get $2
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo2
   i64.or
   local.get $2
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi1
   i64.or
   local.get $2
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi2
   i64.or
   i64.const 0
   i64.ne
   i32.eqz
   br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#isZero|inlined.2
  end
  if
   i32.const 8016
   i32.const 6032
   i32.const 353
   i32.const 21
   call $~lib/builtins/abort
   unreachable
  end
  block $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#isZero|inlined.3 (result i32)
   local.get $0
   local.set $3
   local.get $3
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo1
   local.get $3
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo2
   i64.or
   local.get $3
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi1
   i64.or
   local.get $3
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi2
   i64.or
   i64.const 0
   i64.ne
   i32.eqz
   br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#isZero|inlined.3
  end
  if (result i32)
   i32.const 1
  else
   local.get $0
   local.get $1
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.lt
  end
  if
   block $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.get:Zero|inlined.10 (result i32)
    i32.const 0
    i64.const 0
    i64.const 0
    i64.const 0
    i64.const 0
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#constructor
    br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.get:Zero|inlined.10
   end
   return
  end
  block $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.eq|inlined.0 (result i32)
   local.get $0
   local.set $4
   local.get $1
   local.set $5
   local.get $4
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo1
   local.get $5
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo1
   i64.eq
   if (result i32)
    local.get $4
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo2
    local.get $5
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo2
    i64.eq
   else
    i32.const 0
   end
   if (result i32)
    local.get $4
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi1
    local.get $5
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi1
    i64.eq
   else
    i32.const 0
   end
   if (result i32)
    local.get $4
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi2
    local.get $5
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi2
    i64.eq
   else
    i32.const 0
   end
   br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.eq|inlined.0
  end
  if
   block $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.get:One|inlined.6 (result i32)
    i32.const 0
    i64.const 1
    i64.const 0
    i64.const 0
    i64.const 0
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#constructor
    br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.get:One|inlined.6
   end
   return
  end
  local.get $0
  call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#clone
  local.set $6
  local.get $1
  call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#clone
  local.set $7
  block $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.get:Zero|inlined.11 (result i32)
   i32.const 0
   i64.const 0
   i64.const 0
   i64.const 0
   i64.const 0
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#constructor
   br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.get:Zero|inlined.11
  end
  call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#clone
  local.set $8
  block $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.clz|inlined.0 (result i32)
   local.get $7
   local.set $9
   local.get $9
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi2
   i64.const 0
   i64.ne
   if
    local.get $9
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi2
    i64.clz
    i32.wrap_i64
    br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.clz|inlined.0
   end
   local.get $9
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi1
   i64.const 0
   i64.ne
   if
    local.get $9
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi1
    i64.clz
    i64.const 64
    i64.add
    i32.wrap_i64
    br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.clz|inlined.0
   end
   local.get $9
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo2
   i64.const 0
   i64.ne
   if
    local.get $9
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo2
    i64.clz
    i64.const 128
    i64.add
    i32.wrap_i64
    br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.clz|inlined.0
   end
   local.get $9
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo1
   i64.const 0
   i64.ne
   if
    local.get $9
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo1
    i64.clz
    i64.const 192
    i64.add
    i32.wrap_i64
    br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.clz|inlined.0
   end
   i32.const 256
   br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.clz|inlined.0
  end
  block $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.clz|inlined.1 (result i32)
   local.get $6
   local.set $10
   local.get $10
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi2
   i64.const 0
   i64.ne
   if
    local.get $10
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi2
    i64.clz
    i32.wrap_i64
    br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.clz|inlined.1
   end
   local.get $10
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi1
   i64.const 0
   i64.ne
   if
    local.get $10
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi1
    i64.clz
    i64.const 64
    i64.add
    i32.wrap_i64
    br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.clz|inlined.1
   end
   local.get $10
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo2
   i64.const 0
   i64.ne
   if
    local.get $10
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo2
    i64.clz
    i64.const 128
    i64.add
    i32.wrap_i64
    br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.clz|inlined.1
   end
   local.get $10
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo1
   i64.const 0
   i64.ne
   if
    local.get $10
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo1
    i64.clz
    i64.const 192
    i64.add
    i32.wrap_i64
    br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.clz|inlined.1
   end
   i32.const 256
   br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.clz|inlined.1
  end
  i32.sub
  local.set $11
  local.get $7
  local.get $11
  call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.shl
  local.set $7
  local.get $11
  local.set $12
  loop $for-loop|0
   local.get $12
   i32.const 0
   i32.ge_s
   if
    block $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.ge|inlined.0 (result i32)
     local.get $6
     local.set $13
     local.get $7
     local.set $14
     local.get $13
     local.get $14
     call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.lt
     i32.eqz
     br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.ge|inlined.0
    end
    if
     local.get $6
     local.set $15
     local.get $7
     local.set $16
     block $~lib/@btc-vision/as-bignum/assembly/globals/sub64|inlined.0 (result i64)
      local.get $15
      call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo1
      local.set $17
      local.get $16
      call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo1
      local.set $18
      i64.const 0
      local.set $19
      local.get $17
      local.get $18
      i64.sub
      local.set $20
      local.get $20
      local.get $17
      i64.gt_u
      if (result i32)
       i32.const 1
      else
       i32.const 0
      end
      local.set $21
      local.get $20
      local.get $19
      i64.sub
      local.set $22
      local.get $21
      local.get $22
      local.get $20
      i64.gt_u
      if (result i32)
       i32.const 1
      else
       i32.const 0
      end
      i32.add
      local.set $21
      local.get $21
      i64.extend_i32_s
      global.set $~lib/@btc-vision/as-bignum/assembly/globals/__u256carrySub
      local.get $22
      br $~lib/@btc-vision/as-bignum/assembly/globals/sub64|inlined.0
     end
     local.set $23
     global.get $~lib/@btc-vision/as-bignum/assembly/globals/__u256carrySub
     local.set $24
     block $~lib/@btc-vision/as-bignum/assembly/globals/sub64|inlined.1 (result i64)
      local.get $15
      call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo2
      local.set $25
      local.get $16
      call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo2
      local.set $26
      local.get $24
      local.set $27
      local.get $25
      local.get $26
      i64.sub
      local.set $28
      local.get $28
      local.get $25
      i64.gt_u
      if (result i32)
       i32.const 1
      else
       i32.const 0
      end
      local.set $29
      local.get $28
      local.get $27
      i64.sub
      local.set $30
      local.get $29
      local.get $30
      local.get $28
      i64.gt_u
      if (result i32)
       i32.const 1
      else
       i32.const 0
      end
      i32.add
      local.set $29
      local.get $29
      i64.extend_i32_s
      global.set $~lib/@btc-vision/as-bignum/assembly/globals/__u256carrySub
      local.get $30
      br $~lib/@btc-vision/as-bignum/assembly/globals/sub64|inlined.1
     end
     local.set $31
     global.get $~lib/@btc-vision/as-bignum/assembly/globals/__u256carrySub
     local.set $32
     block $~lib/@btc-vision/as-bignum/assembly/globals/sub64|inlined.2 (result i64)
      local.get $15
      call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi1
      local.set $33
      local.get $16
      call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi1
      local.set $34
      local.get $32
      local.set $35
      local.get $33
      local.get $34
      i64.sub
      local.set $36
      local.get $36
      local.get $33
      i64.gt_u
      if (result i32)
       i32.const 1
      else
       i32.const 0
      end
      local.set $37
      local.get $36
      local.get $35
      i64.sub
      local.set $38
      local.get $37
      local.get $38
      local.get $36
      i64.gt_u
      if (result i32)
       i32.const 1
      else
       i32.const 0
      end
      i32.add
      local.set $37
      local.get $37
      i64.extend_i32_s
      global.set $~lib/@btc-vision/as-bignum/assembly/globals/__u256carrySub
      local.get $38
      br $~lib/@btc-vision/as-bignum/assembly/globals/sub64|inlined.2
     end
     local.set $39
     global.get $~lib/@btc-vision/as-bignum/assembly/globals/__u256carrySub
     local.set $40
     block $~lib/@btc-vision/as-bignum/assembly/globals/sub64|inlined.3 (result i64)
      local.get $15
      call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi2
      local.set $41
      local.get $16
      call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi2
      local.set $42
      local.get $40
      local.set $43
      local.get $41
      local.get $42
      i64.sub
      local.set $44
      local.get $44
      local.get $41
      i64.gt_u
      if (result i32)
       i32.const 1
      else
       i32.const 0
      end
      local.set $45
      local.get $44
      local.get $43
      i64.sub
      local.set $46
      local.get $45
      local.get $46
      local.get $44
      i64.gt_u
      if (result i32)
       i32.const 1
      else
       i32.const 0
      end
      i32.add
      local.set $45
      local.get $45
      i64.extend_i32_s
      global.set $~lib/@btc-vision/as-bignum/assembly/globals/__u256carrySub
      local.get $46
      br $~lib/@btc-vision/as-bignum/assembly/globals/sub64|inlined.3
     end
     local.set $47
     local.get $15
     local.get $23
     call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#set:lo1
     local.get $15
     local.get $31
     call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#set:lo2
     local.get $15
     local.get $39
     call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#set:hi1
     local.get $15
     local.get $47
     call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#set:hi2
     local.get $8
     local.set $48
     local.get $12
     local.set $49
     local.get $49
     i32.const 64
     i32.div_s
     i32.const 0
     i32.or
     local.set $50
     local.get $49
     i32.const 64
     i32.rem_s
     local.set $51
     i64.const 1
     local.get $51
     i64.extend_i32_s
     i64.shl
     local.set $52
     local.get $50
     i32.const 0
     i32.eq
     if
      local.get $48
      local.get $48
      call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo1
      local.get $52
      i64.or
      call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#set:lo1
     else
      local.get $50
      i32.const 1
      i32.eq
      if
       local.get $48
       local.get $48
       call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo2
       local.get $52
       i64.or
       call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#set:lo2
      else
       local.get $50
       i32.const 2
       i32.eq
       if
        local.get $48
        local.get $48
        call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi1
        local.get $52
        i64.or
        call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#set:hi1
       else
        local.get $50
        i32.const 3
        i32.eq
        if
         local.get $48
         local.get $48
         call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi2
         local.get $52
         i64.or
         call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#set:hi2
        end
       end
      end
     end
    end
    local.get $7
    local.set $53
    local.get $53
    local.get $53
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo1
    i64.const 1
    i64.shr_u
    local.get $53
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo2
    i64.const 63
    i64.shl
    i64.or
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#set:lo1
    local.get $53
    local.get $53
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo2
    i64.const 1
    i64.shr_u
    local.get $53
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi1
    i64.const 63
    i64.shl
    i64.or
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#set:lo2
    local.get $53
    local.get $53
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi1
    i64.const 1
    i64.shr_u
    local.get $53
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi2
    i64.const 63
    i64.shl
    i64.or
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#set:hi1
    local.get $53
    local.get $53
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi2
    i64.const 1
    i64.shr_u
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#set:hi2
    local.get $12
    i32.const 1
    i32.sub
    local.set $12
    br $for-loop|0
   end
  end
  local.get $8
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/types/SafeMath/SafeMath.mul (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  (local $10 i32)
  (local $11 i32)
  block $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#isZero|inlined.0 (result i32)
   local.get $0
   local.set $2
   local.get $2
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo1
   local.get $2
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo2
   i64.or
   local.get $2
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi1
   i64.or
   local.get $2
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi2
   i64.or
   i64.const 0
   i64.ne
   i32.eqz
   br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#isZero|inlined.0
  end
  if (result i32)
   i32.const 1
  else
   block $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#isZero|inlined.1 (result i32)
    local.get $1
    local.set $3
    local.get $3
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo1
    local.get $3
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo2
    i64.or
    local.get $3
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi1
    i64.or
    local.get $3
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi2
    i64.or
    i64.const 0
    i64.ne
    i32.eqz
    br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#isZero|inlined.1
   end
  end
  if
   block $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.get:Zero|inlined.7 (result i32)
    i32.const 0
    i64.const 0
    i64.const 0
    i64.const 0
    i64.const 0
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#constructor
    br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.get:Zero|inlined.7
   end
   return
  end
  block $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.mul|inlined.0 (result i32)
   local.get $0
   local.set $4
   local.get $1
   local.set $5
   local.get $4
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo1
   local.get $4
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo2
   local.get $4
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi1
   local.get $4
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi2
   local.get $5
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo1
   local.get $5
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo2
   local.get $5
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi1
   local.get $5
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi2
   call $~lib/@btc-vision/as-bignum/assembly/globals/__mul256
   br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.mul|inlined.0
  end
  local.set $6
  local.get $6
  local.get $0
  call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.div
  local.set $7
  block $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.ne|inlined.0 (result i32)
   local.get $7
   local.set $8
   local.get $1
   local.set $9
   block $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.eq|inlined.1 (result i32)
    local.get $8
    local.set $10
    local.get $9
    local.set $11
    local.get $10
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo1
    local.get $11
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo1
    i64.eq
    if (result i32)
     local.get $10
     call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo2
     local.get $11
     call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo2
     i64.eq
    else
     i32.const 0
    end
    if (result i32)
     local.get $10
     call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi1
     local.get $11
     call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi1
     i64.eq
    else
     i32.const 0
    end
    if (result i32)
     local.get $10
     call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi2
     local.get $11
     call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi2
     i64.eq
    else
     i32.const 0
    end
    br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.eq|inlined.1
   end
   i32.eqz
   br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.ne|inlined.0
  end
  if
   i32.const 8080
   i32.const 8176
   i32.const 190
   i32.const 28
   call $~lib/builtins/abort
   unreachable
  end
  local.get $6
  return
 )
 (func $~lib/polyfills/bswap<u64> (param $0 i64) (result i64)
  (local $1 i64)
  (local $2 i64)
  (local $3 i64)
  i32.const 1
  drop
  i32.const 8
  i32.const 1
  i32.eq
  drop
  i32.const 8
  i32.const 2
  i32.eq
  drop
  i32.const 8
  i32.const 4
  i32.eq
  drop
  i32.const 8
  i32.const 8
  i32.eq
  drop
  local.get $0
  i64.const 8
  i64.shr_u
  i64.const 71777214294589695
  i64.and
  local.set $1
  local.get $0
  i64.const 71777214294589695
  i64.and
  i64.const 8
  i64.shl
  local.set $2
  local.get $1
  local.get $2
  i64.or
  local.set $3
  local.get $3
  i64.const 16
  i64.shr_u
  i64.const 281470681808895
  i64.and
  local.set $1
  local.get $3
  i64.const 281470681808895
  i64.and
  i64.const 16
  i64.shl
  local.set $2
  local.get $1
  local.get $2
  i64.or
  i64.const 32
  i64.rotr
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/storage/BaseStoredString/BaseStoredString#set:subPointer (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=4
  local.get $0
  local.get $1
  i32.const 0
  call $~lib/rt/stub/__link
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/storage/BaseStoredString/BaseStoredString#set:MAX_LENGTH (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/storage/BaseStoredString/BaseStoredString#set:pointer (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store16 offset=8
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/storage/BaseStoredString/BaseStoredString#set:_value (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=12
  local.get $0
  local.get $1
  i32.const 0
  call $~lib/rt/stub/__link
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/storage/BaseStoredString/BaseStoredString#constructor (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32) (result i32)
  local.get $0
  i32.eqz
  if
   i32.const 16
   i32.const 48
   call $~lib/rt/stub/__new
   local.set $0
  end
  local.get $0
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/storage/BaseStoredString/BaseStoredString#set:pointer
  local.get $0
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/storage/BaseStoredString/BaseStoredString#set:MAX_LENGTH
  local.get $0
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/storage/BaseStoredString/BaseStoredString#set:subPointer
  local.get $0
  i32.const 96
  call $~lib/@btc-vision/btc-runtime/runtime/storage/BaseStoredString/BaseStoredString#set:_value
  local.get $0
  local.get $2
  call $~lib/@btc-vision/btc-runtime/runtime/storage/BaseStoredString/BaseStoredString#set:subPointer
  local.get $0
  local.get $3
  call $~lib/@btc-vision/btc-runtime/runtime/storage/BaseStoredString/BaseStoredString#set:MAX_LENGTH
  local.get $0
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/storage/StoredString/StoredString#constructor (param $0 i32) (param $1 i32) (param $2 i64) (result i32)
  (local $3 i64)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  (local $10 i32)
  (local $11 i32)
  (local $12 i32)
  (local $13 i32)
  (local $14 i32)
  (local $15 i32)
  local.get $0
  i32.eqz
  if
   i32.const 16
   i32.const 47
   call $~lib/rt/stub/__new
   local.set $0
  end
  block $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.fromU64|inlined.0 (result i32)
   local.get $2
   local.set $3
   local.get $3
   i64.const 0
   i64.eq
   if
    block $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.get:Zero|inlined.6 (result i32)
     i32.const 0
     i64.const 0
     i64.const 0
     i64.const 0
     i64.const 0
     call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#constructor
     br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.get:Zero|inlined.6
    end
    br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.fromU64|inlined.0
   end
   local.get $3
   i64.const 1
   i64.eq
   if
    block $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.get:One|inlined.5 (result i32)
     i32.const 0
     i64.const 1
     i64.const 0
     i64.const 0
     i64.const 0
     call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#constructor
     br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.get:One|inlined.5
    end
    br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.fromU64|inlined.0
   end
   i32.const 0
   local.get $3
   i64.const 0
   i64.const 0
   i64.const 0
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#constructor
   br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.fromU64|inlined.0
  end
  global.get $~lib/@btc-vision/btc-runtime/runtime/storage/StoredString/StoredString.MAX_LENGTH_U256
  call $~lib/@btc-vision/btc-runtime/runtime/types/SafeMath/SafeMath.mul
  local.set $4
  block $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#toUint8Array|inlined.0 (result i32)
   local.get $4
   local.set $5
   i32.const 1
   local.set $6
   i32.const 0
   i32.const 32
   call $~lib/typedarray/Uint8Array#constructor
   local.set $7
   local.get $5
   local.set $8
   local.get $7
   call $~lib/arraybuffer/ArrayBufferView#get:dataStart
   local.set $9
   local.get $6
   local.set $10
   local.get $10
   if
    local.get $8
    local.set $11
    local.get $9
    local.set $12
    local.get $12
    local.get $11
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi2
    call $~lib/polyfills/bswap<u64>
    i64.store
    local.get $12
    local.get $11
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi1
    call $~lib/polyfills/bswap<u64>
    i64.store offset=8
    local.get $12
    local.get $11
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo2
    call $~lib/polyfills/bswap<u64>
    i64.store offset=16
    local.get $12
    local.get $11
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo1
    call $~lib/polyfills/bswap<u64>
    i64.store offset=24
   else
    local.get $8
    local.set $13
    local.get $9
    local.set $14
    local.get $14
    local.get $13
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo1
    i64.store
    local.get $14
    local.get $13
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo2
    i64.store offset=8
    local.get $14
    local.get $13
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi1
    i64.store offset=16
    local.get $14
    local.get $13
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi2
    i64.store offset=24
   end
   local.get $7
   br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#toUint8Array|inlined.0
  end
  i32.const 2
  i32.const 32
  call $~lib/typedarray/Uint8Array#slice
  local.set $15
  local.get $0
  local.get $1
  local.get $15
  global.get $~lib/@btc-vision/btc-runtime/runtime/storage/StoredString/StoredString.DEFAULT_MAX_LENGTH
  call $~lib/@btc-vision/btc-runtime/runtime/storage/BaseStoredString/BaseStoredString#constructor
  local.set $0
  local.get $0
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#set:_name (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=36
  local.get $0
  local.get $1
  i32.const 0
  call $~lib/rt/stub/__link
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#set:_symbol (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=44
  local.get $0
  local.get $1
  i32.const 0
  call $~lib/rt/stub/__link
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#set:_icon (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=40
  local.get $0
  local.get $1
  i32.const 0
  call $~lib/rt/stub/__link
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#set:reentrancyLevel (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=12
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#constructor (param $0 i32) (result i32)
  local.get $0
  i32.eqz
  if
   i32.const 52
   i32.const 35
   call $~lib/rt/stub/__new
   local.set $0
  end
  local.get $0
  global.get $~lib/@btc-vision/btc-runtime/runtime/contracts/ReentrancyGuard/ReentrancyLevel.CALLBACK
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#set:reentrancyLevel
  local.get $0
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#set:_totalSupply
  local.get $0
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#set:allowanceMap
  local.get $0
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#set:balanceOfMap
  local.get $0
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#set:_maxSupply
  local.get $0
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#set:_decimals
  local.get $0
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#set:_name
  local.get $0
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#set:_icon
  local.get $0
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#set:_symbol
  local.get $0
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#set:_nonceMap
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/ReentrancyGuard/ReentrancyGuard#constructor
  local.set $0
  local.get $0
  i32.const 0
  global.get $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/allowanceMapPointer
  call $~lib/@btc-vision/btc-runtime/runtime/memory/MapOfMap/MapOfMap<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>#constructor
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#set:allowanceMap
  local.get $0
  i32.const 0
  global.get $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/balanceOfMapPointer
  call $~lib/@btc-vision/btc-runtime/runtime/memory/AddressMemoryMap/AddressMemoryMap#constructor
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#set:balanceOfMap
  local.get $0
  i32.const 0
  global.get $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/nonceMapPointer
  call $~lib/@btc-vision/btc-runtime/runtime/memory/AddressMemoryMap/AddressMemoryMap#constructor
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#set:_nonceMap
  local.get $0
  i32.const 0
  global.get $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/totalSupplyPointer
  global.get $~lib/@btc-vision/btc-runtime/runtime/math/bytes/EMPTY_POINTER
  call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredU256/StoredU256#constructor
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#set:_totalSupply
  local.get $0
  i32.const 0
  global.get $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/maxSupplyPointer
  global.get $~lib/@btc-vision/btc-runtime/runtime/math/bytes/EMPTY_POINTER
  call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredU256/StoredU256#constructor
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#set:_maxSupply
  local.get $0
  i32.const 0
  global.get $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/decimalsPointer
  global.get $~lib/@btc-vision/btc-runtime/runtime/math/bytes/EMPTY_POINTER
  call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredU256/StoredU256#constructor
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#set:_decimals
  local.get $0
  i32.const 0
  global.get $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/namePointer
  i64.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredString/StoredString#constructor
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#set:_name
  local.get $0
  i32.const 0
  global.get $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/symbolPointer
  i64.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredString/StoredString#constructor
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#set:_symbol
  local.get $0
  i32.const 0
  global.get $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/iconPointer
  i64.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredString/StoredString#constructor
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#set:_icon
  local.get $0
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/storage/StoredAddress/StoredAddress#set:addressPointer (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store
  local.get $0
  local.get $1
  i32.const 0
  call $~lib/rt/stub/__link
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/storage/StoredAddress/StoredAddress#set:pointer (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store16 offset=4
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/types/Address/Address#clone (param $0 i32) (result i32)
  (local $1 i32)
  (local $2 i32)
  i32.const 0
  i32.const 0
  i32.const 0
  i32.const 8
  i32.const 8352
  call $~lib/rt/__newArray
  call $~lib/@btc-vision/btc-runtime/runtime/types/Address/Address#constructor
  local.set $2
  local.get $2
  call $~lib/arraybuffer/ArrayBufferView#get:dataStart
  local.get $0
  call $~lib/arraybuffer/ArrayBufferView#get:dataStart
  global.get $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/ADDRESS_BYTE_LENGTH
  memory.copy
  local.get $2
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/types/Address/Address#get:isDefined
  call $~lib/@btc-vision/btc-runtime/runtime/types/Address/Address#set:isDefined
  local.get $2
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/types/Address/Address.zero (result i32)
  global.get $~lib/@btc-vision/btc-runtime/runtime/types/Address/ZERO_ADDRESS
  call $~lib/@btc-vision/btc-runtime/runtime/types/Address/Address#clone@override
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/storage/StoredAddress/StoredAddress#set:_value (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=8
  local.get $0
  local.get $1
  i32.const 0
  call $~lib/rt/stub/__link
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/storage/StoredAddress/StoredAddress#constructor (param $0 i32) (param $1 i32) (result i32)
  local.get $0
  i32.eqz
  if
   i32.const 12
   i32.const 49
   call $~lib/rt/stub/__new
   local.set $0
  end
  local.get $0
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredAddress/StoredAddress#set:pointer
  local.get $0
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredAddress/StoredAddress#set:addressPointer
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/types/Address/Address.zero
  call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredAddress/StoredAddress#set:_value
  local.get $0
  local.get $1
  global.get $~lib/@btc-vision/btc-runtime/runtime/math/bytes/EMPTY_POINTER
  i32.const 1
  i32.const 8304
  call $~lib/@btc-vision/btc-runtime/runtime/math/abi/encodePointer
  call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredAddress/StoredAddress#set:addressPointer
  local.get $0
 )
 (func $src/wrapped/husdt/HUSDT/HUSDT#set:_bridgeAuthority (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=52
  local.get $0
  local.get $1
  i32.const 0
  call $~lib/rt/stub/__link
 )
 (func $src/wrapped/husdt/HUSDT/HUSDT#constructor (param $0 i32) (result i32)
  local.get $0
  i32.eqz
  if
   i32.const 56
   i32.const 34
   call $~lib/rt/stub/__new
   local.set $0
  end
  local.get $0
  i32.const 0
  call $src/wrapped/husdt/HUSDT/HUSDT#set:_bridgeAuthority
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#constructor
  local.set $0
  local.get $0
  i32.const 0
  global.get $src/wrapped/husdt/HUSDT/bridgeAuthorityPointer
  call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredAddress/StoredAddress#constructor
  call $src/wrapped/husdt/HUSDT/HUSDT#set:_bridgeAuthority
  local.get $0
 )
 (func $start:src/wrapped/husdt/index~anonymous|0 (result i32)
  i32.const 0
  call $src/wrapped/husdt/HUSDT/HUSDT#constructor
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:_contract (param $0 i32) (result i32)
  local.get $0
  i32.load offset=28
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:_selfContract (param $0 i32) (result i32)
  local.get $0
  i32.load offset=12
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#createContractIfNotExists (param $0 i32)
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:_contract
  i32.eqz
  if
   i32.const 8416
   i32.const 5536
   i32.const 1324
   i32.const 13
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:_selfContract
  i32.eqz
  if
   local.get $0
   i32.const 0
   global.set $~argumentsLength
   local.get $0
   call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:_contract
   i32.load
   call_indirect (type $12)
   call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#set:_selfContract
  end
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#set:contract (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#set:_contract
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#createContractIfNotExists
 )
 (func $start:src/wrapped/husdt/index
  call $start:~lib/@btc-vision/btc-runtime/runtime/index
  call $start:src/wrapped/husdt/HUSDT
  global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
  i32.const 8384
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#set:contract
 )
 (func $~lib/string/String.UTF8.byteLength (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  local.get $0
  local.set $2
  local.get $2
  local.get $0
  i32.const 20
  i32.sub
  call $~lib/rt/common/OBJECT#get:rtSize
  i32.add
  local.set $3
  local.get $1
  i32.const 0
  i32.ne
  local.set $4
  block $while-break|0
   loop $while-continue|0
    local.get $2
    local.get $3
    i32.lt_u
    if
     local.get $2
     i32.load16_u
     local.set $5
     local.get $5
     i32.const 128
     i32.lt_u
     if
      local.get $1
      local.get $5
      i32.eqz
      i32.and
      if
       br $while-break|0
      end
      local.get $4
      i32.const 1
      i32.add
      local.set $4
     else
      local.get $5
      i32.const 2048
      i32.lt_u
      if
       local.get $4
       i32.const 2
       i32.add
       local.set $4
      else
       local.get $5
       i32.const 64512
       i32.and
       i32.const 55296
       i32.eq
       if (result i32)
        local.get $2
        i32.const 2
        i32.add
        local.get $3
        i32.lt_u
       else
        i32.const 0
       end
       if
        local.get $2
        i32.load16_u offset=2
        i32.const 64512
        i32.and
        i32.const 56320
        i32.eq
        if
         local.get $4
         i32.const 4
         i32.add
         local.set $4
         local.get $2
         i32.const 4
         i32.add
         local.set $2
         br $while-continue|0
        end
       end
       local.get $4
       i32.const 3
       i32.add
       local.set $4
      end
     end
     local.get $2
     i32.const 2
     i32.add
     local.set $2
     br $while-continue|0
    end
   end
  end
  local.get $4
  return
 )
 (func $~lib/string/String.UTF8.encodeUnsafe (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32) (param $4 i32) (result i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  (local $10 i32)
  (local $11 i32)
  (local $12 i32)
  (local $13 i32)
  (local $14 i32)
  (local $15 i32)
  (local $16 i32)
  (local $17 i32)
  (local $18 i32)
  local.get $0
  local.get $1
  i32.const 1
  i32.shl
  i32.add
  local.set $5
  local.get $2
  local.set $6
  loop $while-continue|0
   local.get $0
   local.get $5
   i32.lt_u
   if
    local.get $0
    i32.load16_u
    local.set $7
    local.get $7
    i32.const 128
    i32.lt_u
    if
     local.get $6
     local.get $7
     i32.store8
     local.get $6
     i32.const 1
     i32.add
     local.set $6
     local.get $3
     local.get $7
     i32.eqz
     i32.and
     if
      local.get $6
      local.get $2
      i32.sub
      return
     end
    else
     local.get $7
     i32.const 2048
     i32.lt_u
     if
      local.get $7
      i32.const 6
      i32.shr_u
      i32.const 192
      i32.or
      local.set $8
      local.get $7
      i32.const 63
      i32.and
      i32.const 128
      i32.or
      local.set $9
      local.get $6
      local.get $9
      i32.const 8
      i32.shl
      local.get $8
      i32.or
      i32.store16
      local.get $6
      i32.const 2
      i32.add
      local.set $6
     else
      local.get $7
      i32.const 63488
      i32.and
      i32.const 55296
      i32.eq
      if
       local.get $7
       i32.const 56320
       i32.lt_u
       if (result i32)
        local.get $0
        i32.const 2
        i32.add
        local.get $5
        i32.lt_u
       else
        i32.const 0
       end
       if
        local.get $0
        i32.load16_u offset=2
        local.set $10
        local.get $10
        i32.const 64512
        i32.and
        i32.const 56320
        i32.eq
        if
         i32.const 65536
         local.get $7
         i32.const 1023
         i32.and
         i32.const 10
         i32.shl
         i32.add
         local.get $10
         i32.const 1023
         i32.and
         i32.or
         local.set $7
         local.get $7
         i32.const 18
         i32.shr_u
         i32.const 240
         i32.or
         local.set $11
         local.get $7
         i32.const 12
         i32.shr_u
         i32.const 63
         i32.and
         i32.const 128
         i32.or
         local.set $12
         local.get $7
         i32.const 6
         i32.shr_u
         i32.const 63
         i32.and
         i32.const 128
         i32.or
         local.set $13
         local.get $7
         i32.const 63
         i32.and
         i32.const 128
         i32.or
         local.set $14
         local.get $6
         local.get $14
         i32.const 24
         i32.shl
         local.get $13
         i32.const 16
         i32.shl
         i32.or
         local.get $12
         i32.const 8
         i32.shl
         i32.or
         local.get $11
         i32.or
         i32.store
         local.get $6
         i32.const 4
         i32.add
         local.set $6
         local.get $0
         i32.const 4
         i32.add
         local.set $0
         br $while-continue|0
        end
       end
       local.get $4
       i32.const 0
       i32.ne
       if
        local.get $4
        i32.const 2
        i32.eq
        if
         i32.const 8560
         i32.const 8624
         i32.const 742
         i32.const 49
         call $~lib/builtins/abort
         unreachable
        end
        i32.const 65533
        local.set $7
       end
      end
      local.get $7
      i32.const 12
      i32.shr_u
      i32.const 224
      i32.or
      local.set $15
      local.get $7
      i32.const 6
      i32.shr_u
      i32.const 63
      i32.and
      i32.const 128
      i32.or
      local.set $16
      local.get $7
      i32.const 63
      i32.and
      i32.const 128
      i32.or
      local.set $17
      local.get $6
      local.get $16
      i32.const 8
      i32.shl
      local.get $15
      i32.or
      i32.store16
      local.get $6
      local.get $17
      i32.store8 offset=2
      local.get $6
      i32.const 3
      i32.add
      local.set $6
     end
    end
    local.get $0
    i32.const 2
    i32.add
    local.set $0
    br $while-continue|0
   end
  end
  local.get $3
  if
   local.get $6
   local.tee $18
   i32.const 1
   i32.add
   local.set $6
   local.get $18
   i32.const 0
   i32.store8
  end
  local.get $6
  local.get $2
  i32.sub
  return
 )
 (func $~lib/string/String.UTF8.encode (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  (local $3 i32)
  local.get $0
  local.get $1
  call $~lib/string/String.UTF8.byteLength
  i32.const 1
  call $~lib/rt/stub/__new
  local.set $3
  local.get $0
  local.get $0
  call $~lib/string/String#get:length
  local.get $3
  local.get $1
  local.get $2
  call $~lib/string/String.UTF8.encodeUnsafe
  drop
  local.get $3
  return
 )
 (func $~lib/string/String.UTF8.encode@varargs (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  block $2of2
   block $1of2
    block $0of2
     block $outOfRange
      global.get $~argumentsLength
      i32.const 1
      i32.sub
      br_table $0of2 $1of2 $2of2 $outOfRange
     end
     unreachable
    end
    i32.const 0
    local.set $1
   end
   i32.const 0
   local.set $2
  end
  local.get $0
  local.get $1
  local.get $2
  call $~lib/string/String.UTF8.encode
 )
 (func $~lib/dataview/DataView#set:buffer (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store
  local.get $0
  local.get $1
  i32.const 0
  call $~lib/rt/stub/__link
 )
 (func $~lib/dataview/DataView#set:dataStart (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=4
 )
 (func $~lib/dataview/DataView#set:byteLength (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=8
 )
 (func $~lib/dataview/DataView#constructor (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32) (result i32)
  (local $4 i32)
  local.get $0
  i32.eqz
  if
   i32.const 12
   i32.const 52
   call $~lib/rt/stub/__new
   local.set $0
  end
  local.get $0
  i32.const 0
  call $~lib/dataview/DataView#set:buffer
  local.get $0
  i32.const 0
  call $~lib/dataview/DataView#set:dataStart
  local.get $0
  i32.const 0
  call $~lib/dataview/DataView#set:byteLength
  local.get $3
  i32.const 1073741820
  i32.gt_u
  local.get $2
  local.get $3
  i32.add
  local.get $1
  call $~lib/arraybuffer/ArrayBuffer#get:byteLength
  i32.gt_u
  i32.or
  if
   i32.const 2672
   i32.const 8672
   i32.const 25
   i32.const 7
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  local.get $1
  call $~lib/dataview/DataView#set:buffer
  local.get $1
  local.get $2
  i32.add
  local.set $4
  local.get $0
  local.get $4
  call $~lib/dataview/DataView#set:dataStart
  local.get $0
  local.get $3
  call $~lib/dataview/DataView#set:byteLength
  local.get $0
 )
 (func $~lib/dataview/DataView#constructor@varargs (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32) (result i32)
  block $2of2
   block $1of2
    block $0of2
     block $outOfRange
      global.get $~argumentsLength
      i32.const 1
      i32.sub
      br_table $0of2 $1of2 $2of2 $outOfRange
     end
     unreachable
    end
    i32.const 0
    local.set $2
   end
   local.get $1
   call $~lib/arraybuffer/ArrayBuffer#get:byteLength
   local.set $3
  end
  local.get $0
  local.get $1
  local.get $2
  local.get $3
  call $~lib/dataview/DataView#constructor
 )
 (func $~lib/dataview/DataView#get:byteLength (param $0 i32) (result i32)
  local.get $0
  i32.load offset=8
 )
 (func $~lib/dataview/DataView#get:dataStart (param $0 i32) (result i32)
  local.get $0
  i32.load offset=4
 )
 (func $~lib/polyfills/bswap<u32> (param $0 i32) (result i32)
  i32.const 1
  drop
  i32.const 4
  i32.const 1
  i32.eq
  drop
  i32.const 4
  i32.const 2
  i32.eq
  drop
  i32.const 4
  i32.const 4
  i32.eq
  drop
  local.get $0
  i32.const -16711936
  i32.and
  i32.const 8
  i32.rotl
  local.get $0
  i32.const 16711935
  i32.and
  i32.const 8
  i32.rotr
  i32.or
  return
 )
 (func $~lib/dataview/DataView#setUint32 (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32)
  local.get $1
  i32.const 31
  i32.shr_u
  local.get $1
  i32.const 4
  i32.add
  local.get $0
  call $~lib/dataview/DataView#get:byteLength
  i32.gt_s
  i32.or
  if
   i32.const 3056
   i32.const 8672
   i32.const 142
   i32.const 7
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  call $~lib/dataview/DataView#get:dataStart
  local.get $1
  i32.add
  local.get $3
  if (result i32)
   local.get $2
  else
   local.get $2
   call $~lib/polyfills/bswap<u32>
  end
  i32.store
 )
 (func $~lib/dataview/DataView#setUint8 (param $0 i32) (param $1 i32) (param $2 i32)
  local.get $1
  local.get $0
  call $~lib/dataview/DataView#get:byteLength
  i32.ge_u
  if
   i32.const 3056
   i32.const 8672
   i32.const 128
   i32.const 50
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  call $~lib/dataview/DataView#get:dataStart
  local.get $1
  i32.add
  local.get $2
  i32.store8
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/abort/abort/revertOnError (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  (local $10 i32)
  (local $11 i32)
  (local $12 i32)
  local.get $0
  local.set $4
  local.get $1
  local.set $5
  local.get $2
  i32.const 10
  call $~lib/number/U32#toString
  local.set $6
  local.get $3
  i32.const 10
  call $~lib/number/U32#toString
  local.set $7
  i32.const 8512
  i32.const 0
  local.get $4
  call $~lib/staticarray/StaticArray<~lib/string/String>#__uset
  i32.const 8512
  i32.const 2
  local.get $5
  call $~lib/staticarray/StaticArray<~lib/string/String>#__uset
  i32.const 8512
  i32.const 4
  local.get $6
  call $~lib/staticarray/StaticArray<~lib/string/String>#__uset
  i32.const 8512
  i32.const 6
  local.get $7
  call $~lib/staticarray/StaticArray<~lib/string/String>#__uset
  i32.const 8512
  i32.const 96
  call $~lib/staticarray/StaticArray<~lib/string/String>#join
  local.set $8
  local.get $8
  i32.const 0
  i32.const 1
  global.set $~argumentsLength
  i32.const 0
  call $~lib/string/String.UTF8.encode@varargs
  i32.const 0
  i32.const 1
  global.set $~argumentsLength
  i32.const 0
  call $~lib/typedarray/Uint8Array.wrap@varargs
  local.set $9
  i32.const 0
  i32.const 4
  local.get $9
  call $~lib/typedarray/Uint8Array#get:length
  i32.add
  i32.const 4
  i32.add
  call $~lib/arraybuffer/ArrayBuffer#constructor
  local.set $10
  i32.const 0
  local.get $10
  i32.const 0
  i32.const 1
  global.set $~argumentsLength
  i32.const 0
  call $~lib/dataview/DataView#constructor@varargs
  local.set $11
  local.get $11
  i32.const 0
  i32.const 1668521308
  i32.const 0
  call $~lib/dataview/DataView#setUint32
  local.get $11
  i32.const 4
  local.get $9
  call $~lib/typedarray/Uint8Array#get:length
  i32.const 0
  call $~lib/dataview/DataView#setUint32
  i32.const 0
  local.set $12
  loop $for-loop|0
   local.get $12
   local.get $9
   call $~lib/typedarray/Uint8Array#get:length
   i32.lt_s
   if
    local.get $11
    i32.const 8
    local.get $12
    i32.add
    local.get $9
    local.get $12
    call $~lib/typedarray/Uint8Array#__get
    call $~lib/dataview/DataView#setUint8
    local.get $12
    i32.const 1
    i32.add
    local.set $12
    br $for-loop|0
   end
  end
  i32.const 1
  local.get $10
  local.get $10
  call $~lib/arraybuffer/ArrayBuffer#get:byteLength
  call $~lib/@btc-vision/btc-runtime/runtime/env/global/env_exit
 )
 (func $src/wrapped/husdt/index/abort (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32)
  local.get $0
  local.get $1
  local.get $2
  local.get $3
  call $~lib/@btc-vision/btc-runtime/runtime/abort/abort/revertOnError
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#set:buffer (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store
  local.get $0
  local.get $1
  i32.const 0
  call $~lib/rt/stub/__link
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#set:currentOffset (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=4
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#constructor (param $0 i32) (param $1 i32) (result i32)
  local.get $0
  i32.eqz
  if
   i32.const 8
   i32.const 53
   call $~lib/rt/stub/__new
   local.set $0
  end
  local.get $0
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#set:buffer
  local.get $0
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#set:currentOffset
  local.get $0
  i32.const 0
  local.get $1
  call $~lib/arraybuffer/ArrayBufferView#get:buffer
  i32.const 0
  i32.const 1
  global.set $~argumentsLength
  i32.const 0
  call $~lib/dataview/DataView#constructor@varargs
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#set:buffer
  local.get $0
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#get:currentOffset (param $0 i32) (result i32)
  local.get $0
  i32.load offset=4
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#get:buffer (param $0 i32) (result i32)
  local.get $0
  i32.load
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#verifyEnd (param $0 i32) (param $1 i32)
  (local $2 i32)
  (local $3 i32)
  local.get $1
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#get:buffer
  call $~lib/dataview/DataView#get:byteLength
  i32.gt_s
  if
   local.get $1
   i32.const 10
   call $~lib/number/I32#toString
   local.set $2
   i32.const 8912
   i32.const 1
   local.get $2
   call $~lib/staticarray/StaticArray<~lib/string/String>#__uset
   i32.const 8912
   i32.const 96
   call $~lib/staticarray/StaticArray<~lib/string/String>#join
   local.get $0
   call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#get:buffer
   call $~lib/dataview/DataView#get:byteLength
   i32.const 10
   call $~lib/number/I32#toString
   local.set $3
   i32.const 9056
   i32.const 1
   local.get $3
   call $~lib/staticarray/StaticArray<~lib/string/String>#__uset
   i32.const 9056
   i32.const 96
   call $~lib/staticarray/StaticArray<~lib/string/String>#join
   call $~lib/string/String.__concat
   i32.const 9088
   i32.const 442
   i32.const 13
   call $~lib/builtins/abort
   unreachable
  end
 )
 (func $~lib/dataview/DataView#getUint8 (param $0 i32) (param $1 i32) (result i32)
  local.get $1
  local.get $0
  call $~lib/dataview/DataView#get:byteLength
  i32.ge_u
  if
   i32.const 3056
   i32.const 8672
   i32.const 72
   i32.const 50
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  call $~lib/dataview/DataView#get:dataStart
  local.get $1
  i32.add
  i32.load8_u
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readU8 (param $0 i32) (result i32)
  (local $1 i32)
  local.get $0
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#get:currentOffset
  global.get $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/U8_BYTE_LENGTH
  i32.add
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#verifyEnd
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#get:buffer
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#get:currentOffset
  call $~lib/dataview/DataView#getUint8
  local.set $1
  local.get $0
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#get:currentOffset
  global.get $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/U8_BYTE_LENGTH
  i32.add
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#set:currentOffset
  local.get $1
  return
 )
 (func $~lib/typedarray/Uint8Array#subarray (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  (local $10 i32)
  (local $11 i32)
  (local $12 i32)
  (local $13 i32)
  (local $14 i32)
  (local $15 i32)
  (local $16 i32)
  (local $17 i32)
  (local $18 i32)
  block $"~lib/typedarray/SUBARRAY<~lib/typedarray/Uint8Array,u8>|inlined.0" (result i32)
   local.get $0
   local.set $3
   local.get $1
   local.set $4
   local.get $2
   local.set $5
   local.get $3
   call $~lib/typedarray/Uint8Array#get:length
   local.set $6
   local.get $4
   i32.const 0
   i32.lt_s
   if (result i32)
    local.get $6
    local.get $4
    i32.add
    local.tee $7
    i32.const 0
    local.tee $8
    local.get $7
    local.get $8
    i32.gt_s
    select
   else
    local.get $4
    local.tee $9
    local.get $6
    local.tee $10
    local.get $9
    local.get $10
    i32.lt_s
    select
   end
   local.set $4
   local.get $5
   i32.const 0
   i32.lt_s
   if (result i32)
    local.get $6
    local.get $5
    i32.add
    local.tee $11
    i32.const 0
    local.tee $12
    local.get $11
    local.get $12
    i32.gt_s
    select
   else
    local.get $5
    local.tee $13
    local.get $6
    local.tee $14
    local.get $13
    local.get $14
    i32.lt_s
    select
   end
   local.set $5
   local.get $5
   local.tee $15
   local.get $4
   local.tee $16
   local.get $15
   local.get $16
   i32.gt_s
   select
   local.set $5
   i32.const 12
   i32.const 7
   call $~lib/rt/stub/__new
   local.set $17
   local.get $3
   call $~lib/arraybuffer/ArrayBufferView#get:buffer
   local.set $18
   local.get $17
   local.get $18
   i32.store
   local.get $17
   local.get $18
   i32.const 0
   call $~lib/rt/stub/__link
   local.get $17
   local.get $3
   call $~lib/arraybuffer/ArrayBufferView#get:dataStart
   local.get $4
   i32.const 0
   i32.shl
   i32.add
   i32.store offset=4
   local.get $17
   local.get $5
   local.get $4
   i32.sub
   i32.const 0
   i32.shl
   i32.store offset=8
   local.get $17
   br $"~lib/typedarray/SUBARRAY<~lib/typedarray/Uint8Array,u8>|inlined.0"
  end
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readBytes (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  i32.const 0
  local.get $1
  call $~lib/typedarray/Uint8Array#constructor
  local.set $3
  i32.const 0
  local.set $4
  block $for-break0
   loop $for-loop|0
    local.get $4
    local.get $1
    i32.lt_u
    if
     local.get $0
     call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readU8
     local.set $5
     local.get $2
     if (result i32)
      local.get $5
      i32.const 0
      i32.eq
     else
      i32.const 0
     end
     if
      local.get $3
      i32.const 0
      local.get $4
      call $~lib/typedarray/Uint8Array#subarray
      local.set $3
      br $for-break0
     end
     local.get $3
     local.get $4
     local.get $5
     call $~lib/typedarray/Uint8Array#__set
     local.get $4
     i32.const 1
     i32.add
     local.set $4
     br $for-loop|0
    end
   end
  end
  local.get $3
  return
 )
 (func $~lib/dataview/DataView#getUint64 (param $0 i32) (param $1 i32) (param $2 i32) (result i64)
  (local $3 i64)
  local.get $1
  i32.const 31
  i32.shr_u
  local.get $1
  i32.const 8
  i32.add
  local.get $0
  call $~lib/dataview/DataView#get:byteLength
  i32.gt_s
  i32.or
  if
   i32.const 3056
   i32.const 8672
   i32.const 159
   i32.const 7
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  call $~lib/dataview/DataView#get:dataStart
  local.get $1
  i32.add
  i64.load
  local.set $3
  local.get $2
  if (result i64)
   local.get $3
  else
   local.get $3
   call $~lib/polyfills/bswap<u64>
  end
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readU64 (param $0 i32) (param $1 i32) (result i64)
  (local $2 i64)
  local.get $0
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#get:currentOffset
  global.get $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/U64_BYTE_LENGTH
  i32.add
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#verifyEnd
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#get:buffer
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#get:currentOffset
  local.get $1
  i32.eqz
  call $~lib/dataview/DataView#getUint64
  local.set $2
  local.get $0
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#get:currentOffset
  global.get $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/U64_BYTE_LENGTH
  i32.add
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#set:currentOffset
  local.get $2
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/types/Address/Address#___set (param $0 i32) (param $1 i32) (param $2 i32)
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/types/Address/Address#get:isDefined
  if
   i32.const 9264
   i32.const 2928
   i32.const 378
   i32.const 13
   call $~lib/builtins/abort
   unreachable
  end
  local.get $1
  local.get $0
  call $~lib/typedarray/Uint8Array#get:length
  i32.ge_u
  if
   i32.const 3056
   i32.const 2928
   i32.const 382
   i32.const 13
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  call $~lib/arraybuffer/ArrayBufferView#get:dataStart
  local.get $1
  i32.add
  local.get $2
  i32.store8
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readAddress (param $0 i32) (result i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  local.get $0
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#get:currentOffset
  global.get $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/ADDRESS_BYTE_LENGTH
  i32.add
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#verifyEnd
  i32.const 0
  i32.const 0
  i32.const 0
  i32.const 8
  i32.const 9232
  call $~lib/rt/__newArray
  call $~lib/@btc-vision/btc-runtime/runtime/types/Address/Address#constructor
  local.set $2
  i32.const 0
  local.set $3
  loop $for-loop|0
   local.get $3
   global.get $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/ADDRESS_BYTE_LENGTH
   i32.lt_s
   if
    local.get $2
    local.get $3
    local.get $0
    call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readU8
    call $~lib/@btc-vision/btc-runtime/runtime/types/Address/Address#___set
    local.get $3
    i32.const 1
    i32.add
    local.set $3
    br $for-loop|0
   end
  end
  local.get $2
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/classes/Transaction/Transaction#set:sender (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=4
  local.get $0
  local.get $1
  i32.const 0
  call $~lib/rt/stub/__link
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/classes/Transaction/Transaction#set:origin (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=8
  local.get $0
  local.get $1
  i32.const 0
  call $~lib/rt/stub/__link
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/consensus/ConsensusRules/ConsensusRules#set:value (param $0 i32) (param $1 i64)
  local.get $0
  local.get $1
  i64.store
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/consensus/ConsensusRules/ConsensusRules#constructor (param $0 i32) (param $1 i64) (result i32)
  local.get $0
  i32.eqz
  if
   i32.const 8
   i32.const 26
   call $~lib/rt/stub/__new
   local.set $0
  end
  local.get $0
  i64.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/env/consensus/ConsensusRules/ConsensusRules#set:value
  local.get $0
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/env/consensus/ConsensusRules/ConsensusRules#set:value
  local.get $0
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/classes/Transaction/Transaction#set:consensus (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store
  local.get $0
  local.get $1
  i32.const 0
  call $~lib/rt/stub/__link
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/classes/Transaction/Transaction#set:txId (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=16
  local.get $0
  local.get $1
  i32.const 0
  call $~lib/rt/stub/__link
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/classes/Transaction/Transaction#set:hash (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=20
  local.get $0
  local.get $1
  i32.const 0
  call $~lib/rt/stub/__link
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/decoders/TransactionDecoder/TransactionDecoder#constructor (param $0 i32) (result i32)
  local.get $0
  i32.eqz
  if
   i32.const 0
   i32.const 27
   call $~lib/rt/stub/__new
   local.set $0
  end
  local.get $0
  call $~lib/object/Object#constructor
  local.set $0
  local.get $0
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/classes/Transaction/Transaction#set:transactionDecoder (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=12
  local.get $0
  local.get $1
  i32.const 0
  call $~lib/rt/stub/__link
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/classes/Transaction/Transaction#set:_inputs (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=24
  local.get $0
  local.get $1
  i32.const 0
  call $~lib/rt/stub/__link
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/classes/Transaction/Transaction#set:_outputs (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=28
  local.get $0
  local.get $1
  i32.const 0
  call $~lib/rt/stub/__link
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/classes/Transaction/Transaction#constructor (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32) (param $4 i32) (param $5 i64) (result i32)
  local.get $0
  i32.eqz
  if
   i32.const 32
   i32.const 25
   call $~lib/rt/stub/__new
   local.set $0
  end
  local.get $0
  local.get $3
  call $~lib/@btc-vision/btc-runtime/runtime/env/classes/Transaction/Transaction#set:txId
  local.get $0
  local.get $4
  call $~lib/@btc-vision/btc-runtime/runtime/env/classes/Transaction/Transaction#set:hash
  local.get $0
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/env/classes/Transaction/Transaction#set:consensus
  local.get $0
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/env/classes/Transaction/Transaction#set:sender
  local.get $0
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/env/classes/Transaction/Transaction#set:origin
  local.get $0
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/env/decoders/TransactionDecoder/TransactionDecoder#constructor
  call $~lib/@btc-vision/btc-runtime/runtime/env/classes/Transaction/Transaction#set:transactionDecoder
  local.get $0
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/env/classes/Transaction/Transaction#set:_inputs
  local.get $0
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/env/classes/Transaction/Transaction#set:_outputs
  local.get $0
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/env/classes/Transaction/Transaction#set:sender
  local.get $0
  local.get $2
  call $~lib/@btc-vision/btc-runtime/runtime/env/classes/Transaction/Transaction#set:origin
  local.get $0
  i32.const 0
  local.get $5
  call $~lib/@btc-vision/btc-runtime/runtime/env/consensus/ConsensusRules/ConsensusRules#constructor
  call $~lib/@btc-vision/btc-runtime/runtime/env/classes/Transaction/Transaction#set:consensus
  local.get $0
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:_chainId (param $0 i32) (result i32)
  local.get $0
  i32.load offset=44
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:chainId (param $0 i32) (result i32)
  (local $1 i32)
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:_chainId
  i32.eqz
  if
   i32.const 9344
   i32.const 5536
   i32.const 249
   i32.const 13
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:_chainId
  local.tee $1
  if (result i32)
   local.get $1
  else
   i32.const 9408
   i32.const 5536
   i32.const 251
   i32.const 16
   call $~lib/builtins/abort
   unreachable
  end
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/script/Networks/NetworkManager#get:mainnet (param $0 i32) (result i32)
  local.get $0
  i32.load
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/script/Networks/NetworkManager#equals (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  (local $3 i32)
  local.get $1
  call $~lib/typedarray/Uint8Array#get:length
  local.get $2
  call $~lib/typedarray/Uint8Array#get:length
  i32.ne
  if
   i32.const 0
   return
  end
  i32.const 0
  local.set $3
  loop $for-loop|0
   local.get $3
   local.get $1
   call $~lib/typedarray/Uint8Array#get:length
   i32.lt_s
   if
    local.get $1
    local.get $3
    call $~lib/typedarray/Uint8Array#__get
    local.get $2
    local.get $3
    call $~lib/typedarray/Uint8Array#__get
    i32.ne
    if
     i32.const 0
     return
    end
    local.get $3
    i32.const 1
    i32.add
    local.set $3
    br $for-loop|0
   end
  end
  i32.const 1
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/script/Networks/NetworkManager#get:testnet (param $0 i32) (result i32)
  local.get $0
  i32.load offset=4
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/script/Networks/NetworkManager#get:regtest (param $0 i32) (result i32)
  local.get $0
  i32.load offset=8
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/script/Networks/NetworkManager#fromChainId (param $0 i32) (param $1 i32) (result i32)
  local.get $1
  call $~lib/typedarray/Uint8Array#get:length
  i32.const 32
  i32.ne
  if
   i32.const 9536
   i32.const 9616
   i32.const 75
   i32.const 13
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  local.get $1
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/script/Networks/NetworkManager#get:mainnet
  call $~lib/@btc-vision/btc-runtime/runtime/script/Networks/NetworkManager#equals
  if
   global.get $~lib/@btc-vision/btc-runtime/runtime/script/Networks/Networks.Mainnet
   return
  end
  local.get $0
  local.get $1
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/script/Networks/NetworkManager#get:testnet
  call $~lib/@btc-vision/btc-runtime/runtime/script/Networks/NetworkManager#equals
  if
   global.get $~lib/@btc-vision/btc-runtime/runtime/script/Networks/Networks.Testnet
   return
  end
  local.get $0
  local.get $1
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/script/Networks/NetworkManager#get:regtest
  call $~lib/@btc-vision/btc-runtime/runtime/script/Networks/NetworkManager#equals
  if
   global.get $~lib/@btc-vision/btc-runtime/runtime/script/Networks/Networks.Regtest
   return
  end
  i32.const 9760
  i32.const 9616
  i32.const 82
  i32.const 9
  call $~lib/builtins/abort
  unreachable
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/classes/Block/Block#set:numberU256 (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store
  local.get $0
  local.get $1
  i32.const 0
  call $~lib/rt/stub/__link
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/classes/Block/Block#set:hash (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=4
  local.get $0
  local.get $1
  i32.const 0
  call $~lib/rt/stub/__link
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/classes/Block/Block#set:number (param $0 i32) (param $1 i64)
  local.get $0
  local.get $1
  i64.store offset=8
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/classes/Block/Block#set:medianTimestamp (param $0 i32) (param $1 i64)
  local.get $0
  local.get $1
  i64.store offset=16
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/classes/Block/Block#constructor (param $0 i32) (param $1 i32) (param $2 i64) (param $3 i64) (result i32)
  (local $4 i64)
  local.get $0
  i32.eqz
  if
   i32.const 24
   i32.const 23
   call $~lib/rt/stub/__new
   local.set $0
  end
  local.get $0
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/env/classes/Block/Block#set:hash
  local.get $0
  local.get $2
  call $~lib/@btc-vision/btc-runtime/runtime/env/classes/Block/Block#set:number
  local.get $0
  local.get $3
  call $~lib/@btc-vision/btc-runtime/runtime/env/classes/Block/Block#set:medianTimestamp
  local.get $0
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/env/classes/Block/Block#set:numberU256
  local.get $0
  block $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.fromU64|inlined.1 (result i32)
   local.get $2
   local.set $4
   local.get $4
   i64.const 0
   i64.eq
   if
    block $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.get:Zero|inlined.12 (result i32)
     i32.const 0
     i64.const 0
     i64.const 0
     i64.const 0
     i64.const 0
     call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#constructor
     br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.get:Zero|inlined.12
    end
    br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.fromU64|inlined.1
   end
   local.get $4
   i64.const 1
   i64.eq
   if
    block $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.get:One|inlined.7 (result i32)
     i32.const 0
     i64.const 1
     i64.const 0
     i64.const 0
     i64.const 0
     call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#constructor
     br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.get:One|inlined.7
    end
    br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.fromU64|inlined.1
   end
   i32.const 0
   local.get $4
   i64.const 0
   i64.const 0
   i64.const 0
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#constructor
   br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.fromU64|inlined.1
  end
  call $~lib/@btc-vision/btc-runtime/runtime/env/classes/Block/Block#set:numberU256
  local.get $0
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#setEnvironmentVariables (param $0 i32) (param $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i64)
  (local $5 i64)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  (local $10 i32)
  (local $11 i32)
  (local $12 i32)
  (local $13 i32)
  (local $14 i32)
  (local $15 i32)
  (local $16 i32)
  (local $17 i32)
  (local $18 i32)
  (local $19 i32)
  (local $20 i32)
  (local $21 i32)
  (local $22 i32)
  (local $23 i64)
  (local $24 i32)
  i32.const 0
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#constructor
  local.set $2
  local.get $2
  i32.const 32
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readBytes
  local.set $3
  local.get $2
  i32.const 1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readU64
  local.set $4
  local.get $2
  i32.const 1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readU64
  local.set $5
  local.get $2
  i32.const 32
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readBytes
  local.set $6
  local.get $2
  i32.const 32
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readBytes
  local.set $7
  local.get $2
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readAddress
  local.set $8
  local.get $2
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readAddress
  local.set $9
  local.get $2
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readAddress
  local.set $10
  block $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readBytesArray|inlined.0 (result i32)
   local.get $2
   local.set $11
   i32.const 32
   local.set $12
   i32.const 0
   local.get $12
   call $~lib/array/Array<u8>#constructor
   local.set $13
   i32.const 0
   local.set $14
   loop $for-loop|0
    local.get $14
    local.get $12
    i32.lt_s
    if
     local.get $13
     local.get $14
     local.get $11
     call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readU8
     call $~lib/array/Array<u8>#__set
     local.get $14
     i32.const 1
     i32.add
     local.set $14
     br $for-loop|0
    end
   end
   local.get $13
   br $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readBytesArray|inlined.0
  end
  local.set $15
  local.get $2
  i32.const 32
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readBytes
  local.set $16
  local.get $2
  i32.const 32
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readBytes
  local.set $17
  block $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readBytesArray|inlined.1 (result i32)
   local.get $2
   local.set $18
   global.get $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/ADDRESS_BYTE_LENGTH
   local.set $19
   i32.const 0
   local.get $19
   call $~lib/array/Array<u8>#constructor
   local.set $20
   i32.const 0
   local.set $21
   loop $for-loop|1
    local.get $21
    local.get $19
    i32.lt_s
    if
     local.get $20
     local.get $21
     local.get $18
     call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readU8
     call $~lib/array/Array<u8>#__set
     local.get $21
     i32.const 1
     i32.add
     local.set $21
     br $for-loop|1
    end
   end
   local.get $20
   br $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readBytesArray|inlined.1
  end
  local.set $22
  local.get $2
  i32.const 1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readU64
  local.set $23
  i32.const 0
  local.get $22
  local.get $15
  call $~lib/@btc-vision/btc-runtime/runtime/types/ExtendedAddress/ExtendedAddress#constructor
  local.set $24
  local.get $0
  i32.const 0
  local.get $10
  local.get $24
  local.get $6
  local.get $7
  local.get $23
  call $~lib/@btc-vision/btc-runtime/runtime/env/classes/Transaction/Transaction#constructor
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#set:_tx
  local.get $0
  local.get $9
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#set:_contractDeployer
  local.get $0
  local.get $8
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#set:_contractAddress
  local.get $0
  local.get $16
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#set:_chainId
  local.get $0
  local.get $17
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#set:_protocolId
  local.get $0
  global.get $~lib/@btc-vision/btc-runtime/runtime/script/Networks/Network
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:chainId
  call $~lib/@btc-vision/btc-runtime/runtime/script/Networks/NetworkManager#fromChainId
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#set:_network
  local.get $0
  i32.const 0
  local.get $3
  local.get $4
  local.get $5
  call $~lib/@btc-vision/btc-runtime/runtime/env/classes/Block/Block#constructor
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#set:_block
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#createContractIfNotExists
 )
 (func $~lib/dataview/DataView#getUint32 (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  (local $3 i32)
  local.get $1
  i32.const 31
  i32.shr_u
  local.get $1
  i32.const 4
  i32.add
  local.get $0
  call $~lib/dataview/DataView#get:byteLength
  i32.gt_s
  i32.or
  if
   i32.const 3056
   i32.const 8672
   i32.const 87
   i32.const 7
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  call $~lib/dataview/DataView#get:dataStart
  local.get $1
  i32.add
  i32.load
  local.set $3
  local.get $2
  if (result i32)
   local.get $3
  else
   local.get $3
   call $~lib/polyfills/bswap<u32>
  end
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readU32 (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  local.get $0
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#get:currentOffset
  global.get $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/U32_BYTE_LENGTH
  i32.add
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#verifyEnd
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#get:buffer
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#get:currentOffset
  local.get $1
  i32.eqz
  call $~lib/dataview/DataView#getUint32
  local.set $2
  local.get $0
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#get:currentOffset
  global.get $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/U32_BYTE_LENGTH
  i32.add
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#set:currentOffset
  local.get $2
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readSelector (param $0 i32) (result i32)
  local.get $0
  i32.const 1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readU32
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:contract (param $0 i32) (result i32)
  (local $1 i32)
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:_selfContract
  local.tee $1
  if (result i32)
   local.get $1
  else
   i32.const 9408
   i32.const 5536
   i32.const 158
   i32.const 16
   call $~lib/builtins/abort
   unreachable
  end
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP_NET/OP_NET#get:_plugins (param $0 i32) (result i32)
  local.get $0
  i32.load
 )
 (func $~lib/array/Array<~lib/@btc-vision/btc-runtime/runtime/plugins/Plugin/Plugin>#get:length_ (param $0 i32) (result i32)
  local.get $0
  i32.load offset=12
 )
 (func $~lib/array/Array<~lib/@btc-vision/btc-runtime/runtime/plugins/Plugin/Plugin>#get:length (param $0 i32) (result i32)
  local.get $0
  call $~lib/array/Array<~lib/@btc-vision/btc-runtime/runtime/plugins/Plugin/Plugin>#get:length_
  return
 )
 (func $~lib/array/Array<~lib/@btc-vision/btc-runtime/runtime/plugins/Plugin/Plugin>#get:dataStart (param $0 i32) (result i32)
  local.get $0
  i32.load offset=4
 )
 (func $~lib/array/Array<~lib/@btc-vision/btc-runtime/runtime/plugins/Plugin/Plugin>#__get (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  local.get $1
  local.get $0
  call $~lib/array/Array<~lib/@btc-vision/btc-runtime/runtime/plugins/Plugin/Plugin>#get:length_
  i32.ge_u
  if
   i32.const 3056
   i32.const 4336
   i32.const 114
   i32.const 42
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  call $~lib/array/Array<~lib/@btc-vision/btc-runtime/runtime/plugins/Plugin/Plugin>#get:dataStart
  local.get $1
  i32.const 2
  i32.shl
  i32.add
  i32.load
  local.set $2
  i32.const 1
  drop
  i32.const 0
  i32.eqz
  drop
  local.get $2
  i32.eqz
  if
   i32.const 9824
   i32.const 4336
   i32.const 118
   i32.const 40
   call $~lib/builtins/abort
   unreachable
  end
  local.get $2
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/plugins/Plugin/Plugin#onExecutionStarted (param $0 i32) (param $1 i32) (param $2 i32)
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP_NET/OP_NET#onExecutionStarted (param $0 i32) (param $1 i32) (param $2 i32)
  (local $3 i32)
  i32.const 0
  local.set $3
  loop $for-loop|0
   local.get $3
   local.get $0
   call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP_NET/OP_NET#get:_plugins
   call $~lib/array/Array<~lib/@btc-vision/btc-runtime/runtime/plugins/Plugin/Plugin>#get:length
   i32.lt_s
   if
    local.get $0
    call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP_NET/OP_NET#get:_plugins
    local.get $3
    call $~lib/array/Array<~lib/@btc-vision/btc-runtime/runtime/plugins/Plugin/Plugin>#__get
    local.get $1
    local.get $2
    call $~lib/@btc-vision/btc-runtime/runtime/plugins/Plugin/Plugin#onExecutionStarted
    local.get $3
    i32.const 1
    i32.add
    local.set $3
    br $for-loop|0
   end
  end
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#onExecutionStarted (param $0 i32) (param $1 i32) (param $2 i32)
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:contract
  local.get $1
  local.get $2
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP_NET/OP_NET#onExecutionStarted@override
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/global/sha256 (param $0 i32) (result i32)
  (local $1 i32)
  i32.const 0
  i32.const 32
  call $~lib/arraybuffer/ArrayBuffer#constructor
  local.set $1
  local.get $0
  call $~lib/arraybuffer/ArrayBufferView#get:buffer
  local.get $0
  call $~lib/typedarray/Uint8Array#get:length
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/env/global/_sha256
  local.get $1
  i32.const 0
  i32.const 1
  global.set $~argumentsLength
  i32.const 0
  call $~lib/typedarray/Uint8Array.wrap@varargs
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/math/abi/encodeSelector (param $0 i32) (result i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  local.get $0
  i32.const 0
  i32.const 1
  global.set $~argumentsLength
  i32.const 0
  call $~lib/string/String.UTF8.encode@varargs
  i32.const 0
  i32.const 1
  global.set $~argumentsLength
  i32.const 0
  call $~lib/typedarray/Uint8Array.wrap@varargs
  local.set $1
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/env/global/sha256
  local.set $2
  block $~lib/@btc-vision/btc-runtime/runtime/math/bytes/bytesToU32|inlined.0 (result i32)
   local.get $2
   local.set $3
   local.get $3
   call $~lib/typedarray/Uint8Array#get:length
   i32.const 4
   i32.lt_s
   if
    i32.const 10000
    i32.const 10112
    i32.const 12
    i32.const 9
    call $~lib/builtins/abort
    unreachable
   end
   local.get $3
   i32.const 0
   call $~lib/typedarray/Uint8Array#__get
   i32.const 24
   i32.shl
   local.get $3
   i32.const 1
   call $~lib/typedarray/Uint8Array#__get
   i32.const 16
   i32.shl
   i32.or
   local.get $3
   i32.const 2
   call $~lib/typedarray/Uint8Array#__get
   i32.const 8
   i32.shl
   i32.or
   local.get $3
   i32.const 3
   call $~lib/typedarray/Uint8Array#__get
   i32.or
   br $~lib/@btc-vision/btc-runtime/runtime/math/bytes/bytesToU32|inlined.0
  end
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#set:typedArray (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=8
  local.get $0
  local.get $1
  i32.const 0
  call $~lib/rt/stub/__link
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#set:buffer (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=4
  local.get $0
  local.get $1
  i32.const 0
  call $~lib/rt/stub/__link
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#set:currentOffset (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#constructor (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  local.get $0
  i32.eqz
  if
   i32.const 12
   i32.const 54
   call $~lib/rt/stub/__new
   local.set $0
  end
  local.get $0
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#set:currentOffset
  local.get $0
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#set:buffer
  local.get $0
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#set:typedArray
  local.get $0
  i32.const 0
  local.get $1
  call $~lib/typedarray/Uint8Array#constructor
  local.tee $2
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#set:typedArray
  local.get $2
  local.set $3
  local.get $0
  i32.const 0
  local.get $3
  call $~lib/arraybuffer/ArrayBufferView#get:buffer
  i32.const 0
  i32.const 1
  global.set $~argumentsLength
  i32.const 0
  call $~lib/dataview/DataView#constructor@varargs
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#set:buffer
  local.get $0
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:_contractDeployer (param $0 i32) (result i32)
  local.get $0
  i32.load offset=36
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:contractDeployer (param $0 i32) (result i32)
  (local $1 i32)
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:_contractDeployer
  i32.eqz
  if
   i32.const 10240
   i32.const 5536
   i32.const 208
   i32.const 13
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:_contractDeployer
  local.tee $1
  if (result i32)
   local.get $1
  else
   i32.const 9408
   i32.const 5536
   i32.const 210
   i32.const 16
   call $~lib/builtins/abort
   unreachable
  end
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP_NET/OP_NET#get:contractDeployer (param $0 i32) (result i32)
  global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:contractDeployer
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#fromAddress (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  local.get $1
  call $~lib/arraybuffer/ArrayBufferView#get:byteLength
  global.get $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/ADDRESS_BYTE_LENGTH
  i32.gt_s
  if
   local.get $1
   call $~lib/arraybuffer/ArrayBufferView#get:byteLength
   i32.const 10
   call $~lib/number/I32#toString
   local.set $2
   global.get $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/ADDRESS_BYTE_LENGTH
   i32.const 10
   call $~lib/number/I32#toString
   local.set $3
   i32.const 10432
   i32.const 1
   local.get $2
   call $~lib/staticarray/StaticArray<~lib/string/String>#__uset
   i32.const 10432
   i32.const 3
   local.get $3
   call $~lib/staticarray/StaticArray<~lib/string/String>#__uset
   i32.const 10432
   i32.const 96
   call $~lib/staticarray/StaticArray<~lib/string/String>#join
   i32.const 10480
   i32.const 492
   i32.const 13
   call $~lib/builtins/abort
   unreachable
  end
  local.get $1
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#get:currentOffset (param $0 i32) (result i32)
  local.get $0
  i32.load
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#get:buffer (param $0 i32) (result i32)
  local.get $0
  i32.load offset=4
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#resize (param $0 i32) (param $1 i32)
  (local $2 i32)
  i32.const 10704
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#get:buffer
  call $~lib/dataview/DataView#get:byteLength
  local.get $1
  i32.add
  i32.const 10
  call $~lib/number/I32#toString
  local.set $2
  i32.const 10944
  i32.const 1
  local.get $2
  call $~lib/staticarray/StaticArray<~lib/string/String>#__uset
  i32.const 10944
  i32.const 96
  call $~lib/staticarray/StaticArray<~lib/string/String>#join
  call $~lib/string/String.__concat
  i32.const 10976
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#get:buffer
  call $~lib/dataview/DataView#get:byteLength
  i32.const 10
  call $~lib/number/I32#toString
  call $~lib/string/String#concat
  call $~lib/string/String.__concat
  i32.const 10480
  i32.const 505
  i32.const 9
  call $~lib/builtins/abort
  unreachable
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#allocSafe (param $0 i32) (param $1 i32)
  (local $2 i32)
  (local $3 i32)
  local.get $1
  global.get $~lib/builtins/u32.MAX_VALUE
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#get:currentOffset
  i32.sub
  i32.gt_u
  if
   i32.const 10624
   i32.const 10480
   i32.const 480
   i32.const 13
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#get:currentOffset
  local.get $1
  i32.add
  local.set $2
  local.get $2
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#get:buffer
  call $~lib/dataview/DataView#get:byteLength
  i32.gt_u
  if
   local.get $2
   local.get $0
   call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#get:buffer
   call $~lib/dataview/DataView#get:byteLength
   i32.sub
   local.set $3
   local.get $0
   local.get $3
   call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#resize
  end
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeU8 (param $0 i32) (param $1 i32)
  local.get $0
  global.get $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/U8_BYTE_LENGTH
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#allocSafe
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#get:buffer
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#get:currentOffset
  local.get $1
  call $~lib/dataview/DataView#setUint8
  local.get $0
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#get:currentOffset
  global.get $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/U8_BYTE_LENGTH
  i32.add
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#set:currentOffset
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeBytes (param $0 i32) (param $1 i32)
  (local $2 i32)
  local.get $0
  local.get $1
  call $~lib/typedarray/Uint8Array#get:length
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#allocSafe
  i32.const 0
  local.set $2
  loop $for-loop|0
   local.get $2
   local.get $1
   call $~lib/typedarray/Uint8Array#get:length
   i32.lt_s
   if
    local.get $0
    local.get $1
    local.get $2
    call $~lib/typedarray/Uint8Array#__get
    call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeU8
    local.get $2
    i32.const 1
    i32.add
    local.set $2
    br $for-loop|0
   end
  end
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeAddress (param $0 i32) (param $1 i32)
  (local $2 i32)
  local.get $0
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#fromAddress
  local.set $2
  local.get $0
  local.get $2
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeBytes
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#getOffset (param $0 i32) (result i32)
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#get:currentOffset
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/plugins/Plugin/Plugin#execute (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  i32.const 0
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#setOffset (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#verifyEnd
  local.get $0
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#set:currentOffset
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP_NET/OP_NET#execute (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  block $break|0
   block $case0|0
    local.get $1
    local.set $3
    local.get $3
    i32.const 9952
    call $~lib/@btc-vision/btc-runtime/runtime/math/abi/encodeSelector
    i32.eq
    br_if $case0|0
    br $break|0
   end
   i32.const 0
   global.get $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/ADDRESS_BYTE_LENGTH
   call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#constructor
   local.set $4
   local.get $4
   local.get $0
   call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP_NET/OP_NET#get:contractDeployer
   call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeAddress
   local.get $4
   return
  end
  local.get $2
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#getOffset
  local.set $5
  i32.const 0
  local.set $6
  loop $for-loop|1
   local.get $6
   local.get $0
   call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP_NET/OP_NET#get:_plugins
   call $~lib/array/Array<~lib/@btc-vision/btc-runtime/runtime/plugins/Plugin/Plugin>#get:length
   i32.lt_s
   if
    local.get $0
    call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP_NET/OP_NET#get:_plugins
    local.get $6
    call $~lib/array/Array<~lib/@btc-vision/btc-runtime/runtime/plugins/Plugin/Plugin>#__get
    local.get $1
    local.get $2
    call $~lib/@btc-vision/btc-runtime/runtime/plugins/Plugin/Plugin#execute@override
    local.set $7
    local.get $7
    i32.const 0
    i32.ne
    if
     local.get $7
     return
    end
    local.get $2
    local.get $5
    call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#setOffset
    local.get $6
    i32.const 1
    i32.add
    local.set $6
    br $for-loop|1
   end
  end
  i32.const 11024
  local.get $1
  i32.const 10
  call $~lib/number/U32#toString
  call $~lib/string/String#concat
  i32.const 11088
  i32.const 92
  i32.const 9
  call $~lib/builtins/abort
  unreachable
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/plugins/Plugin/Plugin#onExecutionCompleted (param $0 i32) (param $1 i32) (param $2 i32)
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP_NET/OP_NET#onExecutionCompleted (param $0 i32) (param $1 i32) (param $2 i32)
  (local $3 i32)
  i32.const 0
  local.set $3
  loop $for-loop|0
   local.get $3
   local.get $0
   call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP_NET/OP_NET#get:_plugins
   call $~lib/array/Array<~lib/@btc-vision/btc-runtime/runtime/plugins/Plugin/Plugin>#get:length
   i32.lt_s
   if
    local.get $0
    call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP_NET/OP_NET#get:_plugins
    local.get $3
    call $~lib/array/Array<~lib/@btc-vision/btc-runtime/runtime/plugins/Plugin/Plugin>#__get
    local.get $1
    local.get $2
    call $~lib/@btc-vision/btc-runtime/runtime/plugins/Plugin/Plugin#onExecutionCompleted
    local.get $3
    i32.const 1
    i32.add
    local.set $3
    br $for-loop|0
   end
  end
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#onExecutionCompleted (param $0 i32) (param $1 i32) (param $2 i32)
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:contract
  local.get $1
  local.get $2
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP_NET/OP_NET#onExecutionCompleted@override
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#get:typedArray (param $0 i32) (result i32)
  local.get $0
  i32.load offset=8
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#getBuffer (param $0 i32) (result i32)
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#get:typedArray
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/exports/index/execute (param $0 i32) (result i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  i32.const 0
  global.get $~lib/@btc-vision/btc-runtime/runtime/exports/index/ENVIRONMENT_VARIABLES_BYTE_LENGTH
  call $~lib/arraybuffer/ArrayBuffer#constructor
  local.set $1
  i32.const 0
  global.get $~lib/@btc-vision/btc-runtime/runtime/exports/index/ENVIRONMENT_VARIABLES_BYTE_LENGTH
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/env/global/getEnvironmentVariables
  global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
  local.get $1
  i32.const 0
  i32.const 1
  global.set $~argumentsLength
  i32.const 0
  call $~lib/typedarray/Uint8Array.wrap@varargs
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#setEnvironmentVariables
  i32.const 0
  local.get $0
  call $~lib/arraybuffer/ArrayBuffer#constructor
  local.set $2
  i32.const 0
  local.get $0
  local.get $2
  call $~lib/@btc-vision/btc-runtime/runtime/env/global/getCalldata
  i32.const 0
  local.get $2
  i32.const 0
  i32.const 1
  global.set $~argumentsLength
  i32.const 0
  call $~lib/typedarray/Uint8Array.wrap@varargs
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#constructor
  local.set $3
  local.get $3
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readSelector
  local.set $4
  global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
  local.get $4
  local.get $3
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#onExecutionStarted
  global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:contract
  local.get $4
  local.get $3
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP_NET/OP_NET#execute@override
  local.set $5
  global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
  local.get $4
  local.get $3
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#onExecutionCompleted
  local.get $5
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#getBuffer
  call $~lib/arraybuffer/ArrayBufferView#get:buffer
  local.set $6
  local.get $6
  call $~lib/arraybuffer/ArrayBuffer#get:byteLength
  local.set $7
  local.get $7
  i32.const 0
  i32.gt_s
  if
   i32.const 0
   local.get $6
   local.get $7
   call $~lib/@btc-vision/btc-runtime/runtime/env/global/env_exit
  end
  i32.const 0
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/plugins/Plugin/Plugin#onDeployment (param $0 i32) (param $1 i32)
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP_NET/OP_NET#onDeployment (param $0 i32) (param $1 i32)
  (local $2 i32)
  i32.const 0
  local.set $2
  loop $for-loop|0
   local.get $2
   local.get $0
   call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP_NET/OP_NET#get:_plugins
   call $~lib/array/Array<~lib/@btc-vision/btc-runtime/runtime/plugins/Plugin/Plugin>#get:length
   i32.lt_s
   if
    local.get $0
    call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP_NET/OP_NET#get:_plugins
    local.get $2
    call $~lib/array/Array<~lib/@btc-vision/btc-runtime/runtime/plugins/Plugin/Plugin>#__get
    local.get $1
    call $~lib/@btc-vision/btc-runtime/runtime/plugins/Plugin/Plugin#onDeployment
    local.get $2
    i32.const 1
    i32.add
    local.set $2
    br $for-loop|0
   end
  end
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#onDeployment (param $0 i32) (param $1 i32)
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:contract
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP_NET/OP_NET#onDeployment@override
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/exports/index/onDeploy (param $0 i32) (result i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  i32.const 0
  global.get $~lib/@btc-vision/btc-runtime/runtime/exports/index/ENVIRONMENT_VARIABLES_BYTE_LENGTH
  call $~lib/arraybuffer/ArrayBuffer#constructor
  local.set $1
  i32.const 0
  global.get $~lib/@btc-vision/btc-runtime/runtime/exports/index/ENVIRONMENT_VARIABLES_BYTE_LENGTH
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/env/global/getEnvironmentVariables
  global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
  local.get $1
  i32.const 0
  i32.const 1
  global.set $~argumentsLength
  i32.const 0
  call $~lib/typedarray/Uint8Array.wrap@varargs
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#setEnvironmentVariables
  i32.const 0
  local.get $0
  call $~lib/arraybuffer/ArrayBuffer#constructor
  local.set $2
  i32.const 0
  local.get $0
  local.get $2
  call $~lib/@btc-vision/btc-runtime/runtime/env/global/getCalldata
  i32.const 0
  local.get $2
  i32.const 0
  i32.const 1
  global.set $~argumentsLength
  i32.const 0
  call $~lib/typedarray/Uint8Array.wrap@varargs
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#constructor
  local.set $3
  global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
  i32.const 0
  local.get $3
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#onExecutionStarted
  global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
  local.get $3
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#onDeployment
  global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
  i32.const 0
  local.get $3
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#onExecutionCompleted
  i32.const 0
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/plugins/Plugin/Plugin#onUpdate (param $0 i32) (param $1 i32)
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP_NET/OP_NET#onUpdate (param $0 i32) (param $1 i32)
  (local $2 i32)
  i32.const 0
  local.set $2
  loop $for-loop|0
   local.get $2
   local.get $0
   call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP_NET/OP_NET#get:_plugins
   call $~lib/array/Array<~lib/@btc-vision/btc-runtime/runtime/plugins/Plugin/Plugin>#get:length
   i32.lt_s
   if
    local.get $0
    call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP_NET/OP_NET#get:_plugins
    local.get $2
    call $~lib/array/Array<~lib/@btc-vision/btc-runtime/runtime/plugins/Plugin/Plugin>#__get
    local.get $1
    call $~lib/@btc-vision/btc-runtime/runtime/plugins/Plugin/Plugin#onUpdate
    local.get $2
    i32.const 1
    i32.add
    local.set $2
    br $for-loop|0
   end
  end
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#onUpdate (param $0 i32) (param $1 i32)
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:contract
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP_NET/OP_NET#onUpdate
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/exports/index/onUpdate (param $0 i32) (result i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  i32.const 0
  global.get $~lib/@btc-vision/btc-runtime/runtime/exports/index/ENVIRONMENT_VARIABLES_BYTE_LENGTH
  call $~lib/arraybuffer/ArrayBuffer#constructor
  local.set $1
  i32.const 0
  global.get $~lib/@btc-vision/btc-runtime/runtime/exports/index/ENVIRONMENT_VARIABLES_BYTE_LENGTH
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/env/global/getEnvironmentVariables
  global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
  local.get $1
  i32.const 0
  i32.const 1
  global.set $~argumentsLength
  i32.const 0
  call $~lib/typedarray/Uint8Array.wrap@varargs
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#setEnvironmentVariables
  i32.const 0
  local.get $0
  call $~lib/arraybuffer/ArrayBuffer#constructor
  local.set $2
  i32.const 0
  local.get $0
  local.get $2
  call $~lib/@btc-vision/btc-runtime/runtime/env/global/getCalldata
  i32.const 0
  local.get $2
  i32.const 0
  i32.const 1
  global.set $~argumentsLength
  i32.const 0
  call $~lib/typedarray/Uint8Array.wrap@varargs
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#constructor
  local.set $3
  global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
  i32.const 0
  local.get $3
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#onExecutionStarted
  global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
  local.get $3
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#onUpdate
  global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
  i32.const 0
  local.get $3
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#onExecutionCompleted
  i32.const 0
  return
 )
 (func $~lib/rt/stub/__pin (param $0 i32) (result i32)
  local.get $0
  return
 )
 (func $~lib/rt/stub/__unpin (param $0 i32)
 )
 (func $~lib/rt/stub/__collect
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/ReentrancyGuard/ReentrancyGuard#isSelectorExcluded (param $0 i32) (param $1 i32) (result i32)
  local.get $1
  global.get $~lib/@btc-vision/btc-runtime/runtime/constants/Exports/ON_OP20_RECEIVED_SELECTOR
  i32.eq
  if (result i32)
   i32.const 1
  else
   local.get $1
   global.get $~lib/@btc-vision/btc-runtime/runtime/constants/Exports/ON_OP721_RECEIVED_SELECTOR
   i32.eq
  end
  if (result i32)
   i32.const 1
  else
   local.get $1
   global.get $~lib/@btc-vision/btc-runtime/runtime/constants/Exports/ON_OP1155_RECEIVED_MAGIC
   i32.eq
  end
  if (result i32)
   i32.const 1
  else
   local.get $1
   global.get $~lib/@btc-vision/btc-runtime/runtime/constants/Exports/ON_OP1155_BATCH_RECEIVED_MAGIC
   i32.eq
  end
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/ReentrancyGuard/ReentrancyGuard#get:reentrancyLevel (param $0 i32) (result i32)
  local.get $0
  i32.load offset=12
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/ReentrancyGuard/ReentrancyGuard#get:_locked (param $0 i32) (result i32)
  local.get $0
  i32.load offset=4
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/storage/StoredBoolean/StoredBoolean#get:pointerBuffer (param $0 i32) (result i32)
  local.get $0
  i32.load
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:storage (param $0 i32) (result i32)
  local.get $0
  i32.load offset=4
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/generic/MapUint8Array/MapUint8Array#get:_lastIndex (param $0 i32) (result i32)
  local.get $0
  i32.load offset=8
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/generic/MapUint8Array/MapUint8Array#get:_keys (param $0 i32) (result i32)
  local.get $0
  i32.load
 )
 (func $~lib/array/Array<~lib/typedarray/Uint8Array>#get:length_ (param $0 i32) (result i32)
  local.get $0
  i32.load offset=12
 )
 (func $~lib/array/Array<~lib/typedarray/Uint8Array>#get:dataStart (param $0 i32) (result i32)
  local.get $0
  i32.load offset=4
 )
 (func $~lib/array/Array<~lib/typedarray/Uint8Array>#__get (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  local.get $1
  local.get $0
  call $~lib/array/Array<~lib/typedarray/Uint8Array>#get:length_
  i32.ge_u
  if
   i32.const 3056
   i32.const 4336
   i32.const 114
   i32.const 42
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  call $~lib/array/Array<~lib/typedarray/Uint8Array>#get:dataStart
  local.get $1
  i32.const 2
  i32.shl
  i32.add
  i32.load
  local.set $2
  i32.const 1
  drop
  i32.const 0
  i32.eqz
  drop
  local.get $2
  i32.eqz
  if
   i32.const 9824
   i32.const 4336
   i32.const 118
   i32.const 40
   call $~lib/builtins/abort
   unreachable
  end
  local.get $2
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/generic/MapUint8Array/MapUint8Array#isLastIndex (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  (local $10 i32)
  (local $11 i32)
  (local $12 i32)
  (local $13 i32)
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/generic/MapUint8Array/MapUint8Array#get:_lastIndex
  i32.const -1
  i32.ne
  if
   local.get $0
   call $~lib/@btc-vision/btc-runtime/runtime/generic/MapUint8Array/MapUint8Array#get:_keys
   local.get $0
   call $~lib/@btc-vision/btc-runtime/runtime/generic/MapUint8Array/MapUint8Array#get:_lastIndex
   call $~lib/array/Array<~lib/typedarray/Uint8Array>#__get
   local.set $2
   local.get $2
   call $~lib/typedarray/Uint8Array#get:length
   local.get $1
   call $~lib/typedarray/Uint8Array#get:length
   i32.eq
   if
    block $~lib/memory/memory.compare|inlined.0 (result i32)
     local.get $2
     call $~lib/arraybuffer/ArrayBufferView#get:dataStart
     local.set $3
     local.get $1
     call $~lib/arraybuffer/ArrayBufferView#get:dataStart
     local.set $4
     local.get $1
     call $~lib/typedarray/Uint8Array#get:length
     local.set $5
     block $~lib/util/memory/memcmp|inlined.0 (result i32)
      local.get $3
      local.set $6
      local.get $4
      local.set $7
      local.get $5
      local.set $8
      local.get $6
      local.get $7
      i32.eq
      if
       i32.const 0
       br $~lib/util/memory/memcmp|inlined.0
      end
      i32.const 0
      i32.const 2
      i32.lt_s
      drop
      local.get $6
      i32.const 7
      i32.and
      local.get $7
      i32.const 7
      i32.and
      i32.eq
      if
       loop $while-continue|0
        local.get $6
        i32.const 7
        i32.and
        if
         local.get $8
         i32.eqz
         if
          i32.const 0
          br $~lib/util/memory/memcmp|inlined.0
         end
         local.get $6
         i32.load8_u
         local.set $9
         local.get $7
         i32.load8_u
         local.set $10
         local.get $9
         local.get $10
         i32.ne
         if
          local.get $9
          local.get $10
          i32.sub
          br $~lib/util/memory/memcmp|inlined.0
         end
         local.get $8
         i32.const 1
         i32.sub
         local.set $8
         local.get $6
         i32.const 1
         i32.add
         local.set $6
         local.get $7
         i32.const 1
         i32.add
         local.set $7
         br $while-continue|0
        end
       end
       block $while-break|1
        loop $while-continue|1
         local.get $8
         i32.const 8
         i32.ge_u
         if
          local.get $6
          i64.load
          local.get $7
          i64.load
          i64.ne
          if
           br $while-break|1
          end
          local.get $6
          i32.const 8
          i32.add
          local.set $6
          local.get $7
          i32.const 8
          i32.add
          local.set $7
          local.get $8
          i32.const 8
          i32.sub
          local.set $8
          br $while-continue|1
         end
        end
       end
      end
      loop $while-continue|2
       local.get $8
       local.tee $11
       i32.const 1
       i32.sub
       local.set $8
       local.get $11
       if
        local.get $6
        i32.load8_u
        local.set $12
        local.get $7
        i32.load8_u
        local.set $13
        local.get $12
        local.get $13
        i32.ne
        if
         local.get $12
         local.get $13
         i32.sub
         br $~lib/util/memory/memcmp|inlined.0
        end
        local.get $6
        i32.const 1
        i32.add
        local.set $6
        local.get $7
        i32.const 1
        i32.add
        local.set $7
        br $while-continue|2
       end
      end
      i32.const 0
      br $~lib/util/memory/memcmp|inlined.0
     end
     br $~lib/memory/memory.compare|inlined.0
    end
    i32.const 0
    i32.eq
    if
     i32.const 1
     return
    end
   end
  end
  i32.const 0
  return
 )
 (func $~lib/array/Array<~lib/typedarray/Uint8Array>#get:length (param $0 i32) (result i32)
  local.get $0
  call $~lib/array/Array<~lib/typedarray/Uint8Array>#get:length_
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/generic/MapUint8Array/MapUint8Array#indexOf (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i64)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  (local $10 i32)
  (local $11 i32)
  (local $12 i32)
  (local $13 i32)
  (local $14 i32)
  (local $15 i32)
  (local $16 i32)
  (local $17 i32)
  (local $18 i32)
  (local $19 i32)
  (local $20 i32)
  (local $21 i32)
  (local $22 i32)
  (local $23 i32)
  (local $24 i32)
  (local $25 i32)
  (local $26 i32)
  (local $27 i32)
  (local $28 i32)
  (local $29 i32)
  (local $30 i32)
  (local $31 i32)
  local.get $0
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/generic/MapUint8Array/MapUint8Array#isLastIndex
  if
   local.get $0
   call $~lib/@btc-vision/btc-runtime/runtime/generic/MapUint8Array/MapUint8Array#get:_lastIndex
   return
  end
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/generic/MapUint8Array/MapUint8Array#get:_keys
  call $~lib/array/Array<~lib/typedarray/Uint8Array>#get:length
  local.set $2
  local.get $2
  i32.const 0
  i32.eq
  if
   i32.const -1
   return
  end
  local.get $1
  call $~lib/typedarray/Uint8Array#get:length
  local.set $3
  local.get $1
  call $~lib/arraybuffer/ArrayBufferView#get:dataStart
  local.set $4
  local.get $3
  i32.const 8
  i32.ge_s
  if
   local.get $4
   i64.load
   local.set $5
   local.get $2
   i32.const 1
   i32.sub
   local.set $6
   loop $for-loop|0
    local.get $6
    i32.const 0
    i32.ge_s
    if
     block $for-continue|0
      local.get $0
      call $~lib/@btc-vision/btc-runtime/runtime/generic/MapUint8Array/MapUint8Array#get:_keys
      local.get $6
      call $~lib/array/Array<~lib/typedarray/Uint8Array>#__get
      local.set $7
      local.get $7
      call $~lib/typedarray/Uint8Array#get:length
      local.get $3
      i32.ne
      if
       br $for-continue|0
      end
      local.get $7
      call $~lib/arraybuffer/ArrayBufferView#get:dataStart
      i64.load
      local.get $5
      i64.ne
      if
       br $for-continue|0
      end
      block $~lib/memory/memory.compare|inlined.1 (result i32)
       local.get $7
       call $~lib/arraybuffer/ArrayBufferView#get:dataStart
       local.set $8
       local.get $4
       local.set $9
       local.get $3
       local.set $10
       block $~lib/util/memory/memcmp|inlined.1 (result i32)
        local.get $8
        local.set $11
        local.get $9
        local.set $12
        local.get $10
        local.set $13
        local.get $11
        local.get $12
        i32.eq
        if
         i32.const 0
         br $~lib/util/memory/memcmp|inlined.1
        end
        i32.const 0
        i32.const 2
        i32.lt_s
        drop
        local.get $11
        i32.const 7
        i32.and
        local.get $12
        i32.const 7
        i32.and
        i32.eq
        if
         loop $while-continue|1
          local.get $11
          i32.const 7
          i32.and
          if
           local.get $13
           i32.eqz
           if
            i32.const 0
            br $~lib/util/memory/memcmp|inlined.1
           end
           local.get $11
           i32.load8_u
           local.set $14
           local.get $12
           i32.load8_u
           local.set $15
           local.get $14
           local.get $15
           i32.ne
           if
            local.get $14
            local.get $15
            i32.sub
            br $~lib/util/memory/memcmp|inlined.1
           end
           local.get $13
           i32.const 1
           i32.sub
           local.set $13
           local.get $11
           i32.const 1
           i32.add
           local.set $11
           local.get $12
           i32.const 1
           i32.add
           local.set $12
           br $while-continue|1
          end
         end
         block $while-break|2
          loop $while-continue|2
           local.get $13
           i32.const 8
           i32.ge_u
           if
            local.get $11
            i64.load
            local.get $12
            i64.load
            i64.ne
            if
             br $while-break|2
            end
            local.get $11
            i32.const 8
            i32.add
            local.set $11
            local.get $12
            i32.const 8
            i32.add
            local.set $12
            local.get $13
            i32.const 8
            i32.sub
            local.set $13
            br $while-continue|2
           end
          end
         end
        end
        loop $while-continue|3
         local.get $13
         local.tee $16
         i32.const 1
         i32.sub
         local.set $13
         local.get $16
         if
          local.get $11
          i32.load8_u
          local.set $17
          local.get $12
          i32.load8_u
          local.set $18
          local.get $17
          local.get $18
          i32.ne
          if
           local.get $17
           local.get $18
           i32.sub
           br $~lib/util/memory/memcmp|inlined.1
          end
          local.get $11
          i32.const 1
          i32.add
          local.set $11
          local.get $12
          i32.const 1
          i32.add
          local.set $12
          br $while-continue|3
         end
        end
        i32.const 0
        br $~lib/util/memory/memcmp|inlined.1
       end
       br $~lib/memory/memory.compare|inlined.1
      end
      i32.const 0
      i32.eq
      if
       local.get $0
       local.get $6
       call $~lib/@btc-vision/btc-runtime/runtime/generic/MapUint8Array/MapUint8Array#set:_lastIndex
       local.get $6
       return
      end
     end
     local.get $6
     i32.const 1
     i32.sub
     local.set $6
     br $for-loop|0
    end
   end
  else
   local.get $2
   i32.const 1
   i32.sub
   local.set $19
   loop $for-loop|4
    local.get $19
    i32.const 0
    i32.ge_s
    if
     block $for-continue|4
      local.get $0
      call $~lib/@btc-vision/btc-runtime/runtime/generic/MapUint8Array/MapUint8Array#get:_keys
      local.get $19
      call $~lib/array/Array<~lib/typedarray/Uint8Array>#__get
      local.set $20
      local.get $20
      call $~lib/typedarray/Uint8Array#get:length
      local.get $3
      i32.ne
      if
       br $for-continue|4
      end
      block $~lib/memory/memory.compare|inlined.2 (result i32)
       local.get $20
       call $~lib/arraybuffer/ArrayBufferView#get:dataStart
       local.set $21
       local.get $4
       local.set $22
       local.get $3
       local.set $23
       block $~lib/util/memory/memcmp|inlined.2 (result i32)
        local.get $21
        local.set $24
        local.get $22
        local.set $25
        local.get $23
        local.set $26
        local.get $24
        local.get $25
        i32.eq
        if
         i32.const 0
         br $~lib/util/memory/memcmp|inlined.2
        end
        i32.const 0
        i32.const 2
        i32.lt_s
        drop
        local.get $24
        i32.const 7
        i32.and
        local.get $25
        i32.const 7
        i32.and
        i32.eq
        if
         loop $while-continue|5
          local.get $24
          i32.const 7
          i32.and
          if
           local.get $26
           i32.eqz
           if
            i32.const 0
            br $~lib/util/memory/memcmp|inlined.2
           end
           local.get $24
           i32.load8_u
           local.set $27
           local.get $25
           i32.load8_u
           local.set $28
           local.get $27
           local.get $28
           i32.ne
           if
            local.get $27
            local.get $28
            i32.sub
            br $~lib/util/memory/memcmp|inlined.2
           end
           local.get $26
           i32.const 1
           i32.sub
           local.set $26
           local.get $24
           i32.const 1
           i32.add
           local.set $24
           local.get $25
           i32.const 1
           i32.add
           local.set $25
           br $while-continue|5
          end
         end
         block $while-break|6
          loop $while-continue|6
           local.get $26
           i32.const 8
           i32.ge_u
           if
            local.get $24
            i64.load
            local.get $25
            i64.load
            i64.ne
            if
             br $while-break|6
            end
            local.get $24
            i32.const 8
            i32.add
            local.set $24
            local.get $25
            i32.const 8
            i32.add
            local.set $25
            local.get $26
            i32.const 8
            i32.sub
            local.set $26
            br $while-continue|6
           end
          end
         end
        end
        loop $while-continue|7
         local.get $26
         local.tee $29
         i32.const 1
         i32.sub
         local.set $26
         local.get $29
         if
          local.get $24
          i32.load8_u
          local.set $30
          local.get $25
          i32.load8_u
          local.set $31
          local.get $30
          local.get $31
          i32.ne
          if
           local.get $30
           local.get $31
           i32.sub
           br $~lib/util/memory/memcmp|inlined.2
          end
          local.get $24
          i32.const 1
          i32.add
          local.set $24
          local.get $25
          i32.const 1
          i32.add
          local.set $25
          br $while-continue|7
         end
        end
        i32.const 0
        br $~lib/util/memory/memcmp|inlined.2
       end
       br $~lib/memory/memory.compare|inlined.2
      end
      i32.const 0
      i32.eq
      if
       local.get $0
       local.get $19
       call $~lib/@btc-vision/btc-runtime/runtime/generic/MapUint8Array/MapUint8Array#set:_lastIndex
       local.get $19
       return
      end
     end
     local.get $19
     i32.const 1
     i32.sub
     local.set $19
     br $for-loop|4
    end
   end
  end
  i32.const -1
  return
 )
 (func $~lib/array/Array<~lib/typedarray/Uint8Array>#set:length_ (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=12
 )
 (func $~lib/array/Array<~lib/typedarray/Uint8Array>#push (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  local.get $0
  call $~lib/array/Array<~lib/typedarray/Uint8Array>#get:length_
  local.set $2
  local.get $2
  i32.const 1
  i32.add
  local.set $3
  local.get $0
  local.get $3
  i32.const 2
  i32.const 1
  call $~lib/array/ensureCapacity
  i32.const 1
  drop
  local.get $0
  call $~lib/array/Array<~lib/typedarray/Uint8Array>#get:dataStart
  local.get $2
  i32.const 2
  i32.shl
  i32.add
  local.get $1
  i32.store
  local.get $0
  local.get $1
  i32.const 1
  call $~lib/rt/stub/__link
  local.get $0
  local.get $3
  call $~lib/array/Array<~lib/typedarray/Uint8Array>#set:length_
  local.get $3
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/generic/MapUint8Array/MapUint8Array#get:_values (param $0 i32) (result i32)
  local.get $0
  i32.load offset=4
 )
 (func $~lib/array/Array<~lib/typedarray/Uint8Array>#__set (param $0 i32) (param $1 i32) (param $2 i32)
  local.get $1
  local.get $0
  call $~lib/array/Array<~lib/typedarray/Uint8Array>#get:length_
  i32.ge_u
  if
   local.get $1
   i32.const 0
   i32.lt_s
   if
    i32.const 3056
    i32.const 4336
    i32.const 130
    i32.const 22
    call $~lib/builtins/abort
    unreachable
   end
   local.get $0
   local.get $1
   i32.const 1
   i32.add
   i32.const 2
   i32.const 1
   call $~lib/array/ensureCapacity
   local.get $0
   local.get $1
   i32.const 1
   i32.add
   call $~lib/array/Array<~lib/typedarray/Uint8Array>#set:length_
  end
  local.get $0
  call $~lib/array/Array<~lib/typedarray/Uint8Array>#get:dataStart
  local.get $1
  i32.const 2
  i32.shl
  i32.add
  local.get $2
  i32.store
  i32.const 1
  drop
  local.get $0
  local.get $2
  i32.const 1
  call $~lib/rt/stub/__link
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/generic/MapUint8Array/MapUint8Array#set (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  (local $3 i32)
  local.get $0
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/generic/MapUint8Array/MapUint8Array#indexOf
  local.set $3
  local.get $3
  i32.const -1
  i32.eq
  if
   local.get $0
   call $~lib/@btc-vision/btc-runtime/runtime/generic/MapUint8Array/MapUint8Array#get:_keys
   local.get $1
   call $~lib/array/Array<~lib/typedarray/Uint8Array>#push
   drop
   local.get $0
   call $~lib/@btc-vision/btc-runtime/runtime/generic/MapUint8Array/MapUint8Array#get:_values
   local.get $2
   call $~lib/array/Array<~lib/typedarray/Uint8Array>#push
   drop
   local.get $0
   local.get $0
   call $~lib/@btc-vision/btc-runtime/runtime/generic/MapUint8Array/MapUint8Array#get:_keys
   call $~lib/array/Array<~lib/typedarray/Uint8Array>#get:length
   i32.const 1
   i32.sub
   call $~lib/@btc-vision/btc-runtime/runtime/generic/MapUint8Array/MapUint8Array#set:_lastIndex
  else
   local.get $0
   call $~lib/@btc-vision/btc-runtime/runtime/generic/MapUint8Array/MapUint8Array#get:_values
   local.get $3
   local.get $2
   call $~lib/array/Array<~lib/typedarray/Uint8Array>#__set
   local.get $0
   local.get $3
   call $~lib/@btc-vision/btc-runtime/runtime/generic/MapUint8Array/MapUint8Array#set:_lastIndex
  end
  local.get $0
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#hasPointerStorageHash (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  (local $10 i32)
  (local $11 i32)
  (local $12 i32)
  (local $13 i32)
  (local $14 i32)
  (local $15 i32)
  (local $16 i32)
  (local $17 i32)
  (local $18 i32)
  local.get $1
  call $~lib/arraybuffer/ArrayBufferView#get:buffer
  call $~lib/arraybuffer/ArrayBuffer#get:byteLength
  i32.const 32
  i32.ne
  if
   i32.const 11232
   i32.const 5536
   i32.const 1361
   i32.const 13
   call $~lib/builtins/abort
   unreachable
  end
  block $~lib/@btc-vision/btc-runtime/runtime/generic/MapUint8Array/MapUint8Array#has|inlined.0 (result i32)
   local.get $0
   call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:storage
   local.set $2
   local.get $1
   local.set $3
   local.get $2
   local.get $3
   call $~lib/@btc-vision/btc-runtime/runtime/generic/MapUint8Array/MapUint8Array#indexOf
   i32.const -1
   i32.ne
   br $~lib/@btc-vision/btc-runtime/runtime/generic/MapUint8Array/MapUint8Array#has|inlined.0
  end
  if
   i32.const 1
   return
  end
  i32.const 0
  i32.const 32
  call $~lib/arraybuffer/ArrayBuffer#constructor
  local.set $4
  local.get $1
  call $~lib/arraybuffer/ArrayBufferView#get:buffer
  local.get $4
  call $~lib/@btc-vision/btc-runtime/runtime/env/global/loadPointer
  local.get $4
  i32.const 0
  i32.const 1
  global.set $~argumentsLength
  i32.const 0
  call $~lib/typedarray/Uint8Array.wrap@varargs
  local.set $5
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:storage
  local.get $1
  local.get $5
  call $~lib/@btc-vision/btc-runtime/runtime/generic/MapUint8Array/MapUint8Array#set
  drop
  block $~lib/@btc-vision/btc-runtime/runtime/generic/MapUint8Array/eqUint|inlined.0 (result i32)
   local.get $5
   local.set $6
   global.get $~lib/@btc-vision/btc-runtime/runtime/math/bytes/EMPTY_BUFFER
   local.set $7
   local.get $6
   call $~lib/typedarray/Uint8Array#get:length
   local.get $7
   call $~lib/typedarray/Uint8Array#get:length
   i32.ne
   if
    i32.const 0
    br $~lib/@btc-vision/btc-runtime/runtime/generic/MapUint8Array/eqUint|inlined.0
   end
   block $~lib/memory/memory.compare|inlined.3 (result i32)
    local.get $6
    call $~lib/arraybuffer/ArrayBufferView#get:dataStart
    local.set $8
    local.get $7
    call $~lib/arraybuffer/ArrayBufferView#get:dataStart
    local.set $9
    local.get $6
    call $~lib/typedarray/Uint8Array#get:length
    local.set $10
    block $~lib/util/memory/memcmp|inlined.3 (result i32)
     local.get $8
     local.set $11
     local.get $9
     local.set $12
     local.get $10
     local.set $13
     local.get $11
     local.get $12
     i32.eq
     if
      i32.const 0
      br $~lib/util/memory/memcmp|inlined.3
     end
     i32.const 0
     i32.const 2
     i32.lt_s
     drop
     local.get $11
     i32.const 7
     i32.and
     local.get $12
     i32.const 7
     i32.and
     i32.eq
     if
      loop $while-continue|0
       local.get $11
       i32.const 7
       i32.and
       if
        local.get $13
        i32.eqz
        if
         i32.const 0
         br $~lib/util/memory/memcmp|inlined.3
        end
        local.get $11
        i32.load8_u
        local.set $14
        local.get $12
        i32.load8_u
        local.set $15
        local.get $14
        local.get $15
        i32.ne
        if
         local.get $14
         local.get $15
         i32.sub
         br $~lib/util/memory/memcmp|inlined.3
        end
        local.get $13
        i32.const 1
        i32.sub
        local.set $13
        local.get $11
        i32.const 1
        i32.add
        local.set $11
        local.get $12
        i32.const 1
        i32.add
        local.set $12
        br $while-continue|0
       end
      end
      block $while-break|1
       loop $while-continue|1
        local.get $13
        i32.const 8
        i32.ge_u
        if
         local.get $11
         i64.load
         local.get $12
         i64.load
         i64.ne
         if
          br $while-break|1
         end
         local.get $11
         i32.const 8
         i32.add
         local.set $11
         local.get $12
         i32.const 8
         i32.add
         local.set $12
         local.get $13
         i32.const 8
         i32.sub
         local.set $13
         br $while-continue|1
        end
       end
      end
     end
     loop $while-continue|2
      local.get $13
      local.tee $16
      i32.const 1
      i32.sub
      local.set $13
      local.get $16
      if
       local.get $11
       i32.load8_u
       local.set $17
       local.get $12
       i32.load8_u
       local.set $18
       local.get $17
       local.get $18
       i32.ne
       if
        local.get $17
        local.get $18
        i32.sub
        br $~lib/util/memory/memcmp|inlined.3
       end
       local.get $11
       i32.const 1
       i32.add
       local.set $11
       local.get $12
       i32.const 1
       i32.add
       local.set $12
       br $while-continue|2
      end
     end
     i32.const 0
     br $~lib/util/memory/memcmp|inlined.3
    end
    br $~lib/memory/memory.compare|inlined.3
   end
   i32.const 0
   i32.eq
   br $~lib/@btc-vision/btc-runtime/runtime/generic/MapUint8Array/eqUint|inlined.0
  end
  i32.eqz
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/generic/MapUint8Array/MapUint8Array#get (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  local.get $0
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/generic/MapUint8Array/MapUint8Array#indexOf
  local.set $2
  local.get $2
  i32.const -1
  i32.eq
  if
   i32.const 11312
   i32.const 11408
   i32.const 118
   i32.const 13
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/generic/MapUint8Array/MapUint8Array#get:_values
  local.get $2
  call $~lib/array/Array<~lib/typedarray/Uint8Array>#__get
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#getStorageAt (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  local.get $0
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#hasPointerStorageHash
  drop
  block $~lib/@btc-vision/btc-runtime/runtime/generic/MapUint8Array/MapUint8Array#has|inlined.1 (result i32)
   local.get $0
   call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:storage
   local.set $2
   local.get $1
   local.set $3
   local.get $2
   local.get $3
   call $~lib/@btc-vision/btc-runtime/runtime/generic/MapUint8Array/MapUint8Array#indexOf
   i32.const -1
   i32.ne
   br $~lib/@btc-vision/btc-runtime/runtime/generic/MapUint8Array/MapUint8Array#has|inlined.1
  end
  if
   local.get $0
   call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:storage
   local.get $1
   call $~lib/@btc-vision/btc-runtime/runtime/generic/MapUint8Array/MapUint8Array#get
   return
  end
  i32.const 0
  i32.const 32
  call $~lib/typedarray/Uint8Array#constructor
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/storage/StoredBoolean/StoredBoolean#ensureValue (param $0 i32)
  local.get $0
  global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredBoolean/StoredBoolean#get:pointerBuffer
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#getStorageAt
  call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredBoolean/StoredBoolean#set:_value
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/storage/StoredBoolean/StoredBoolean#get:_value (param $0 i32) (result i32)
  local.get $0
  i32.load offset=8
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/ReentrancyGuard/ReentrancyGuard#reentrancyGuardReentrantCall (param $0 i32)
  i32.const 11552
  i32.const 11632
  i32.const 125
  i32.const 9
  call $~lib/builtins/abort
  unreachable
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#_internalSetStorageAt (param $0 i32) (param $1 i32) (param $2 i32)
  (local $3 i32)
  (local $4 i32)
  local.get $1
  call $~lib/typedarray/Uint8Array#get:length
  i32.const 32
  i32.ne
  if
   i32.const 11232
   i32.const 5536
   i32.const 1334
   i32.const 13
   call $~lib/builtins/abort
   unreachable
  end
  local.get $2
  local.set $3
  local.get $2
  call $~lib/typedarray/Uint8Array#get:length
  i32.const 32
  i32.ne
  if
   i32.const 0
   i32.const 32
   call $~lib/typedarray/Uint8Array#constructor
   local.set $3
   local.get $2
   call $~lib/typedarray/Uint8Array#get:length
   i32.const 32
   i32.lt_s
   if (result i32)
    local.get $2
    call $~lib/typedarray/Uint8Array#get:length
   else
    i32.const 32
   end
   local.set $4
   local.get $3
   call $~lib/arraybuffer/ArrayBufferView#get:dataStart
   local.get $2
   call $~lib/arraybuffer/ArrayBufferView#get:dataStart
   local.get $4
   memory.copy
  end
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:storage
  local.get $1
  local.get $3
  call $~lib/@btc-vision/btc-runtime/runtime/generic/MapUint8Array/MapUint8Array#set
  drop
  local.get $1
  call $~lib/arraybuffer/ArrayBufferView#get:buffer
  local.get $3
  call $~lib/arraybuffer/ArrayBufferView#get:buffer
  call $~lib/@btc-vision/btc-runtime/runtime/env/global/storePointer
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/storage/StoredBoolean/StoredBoolean#set:value (param $0 i32) (param $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredBoolean/StoredBoolean#get:_value
  i32.const 0
  local.get $1
  if (result i32)
   i32.const 1
  else
   i32.const 0
  end
  call $~lib/typedarray/Uint8Array#__set
  global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
  local.set $2
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredBoolean/StoredBoolean#get:pointerBuffer
  local.set $3
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredBoolean/StoredBoolean#get:_value
  local.set $4
  local.get $2
  local.get $3
  local.get $4
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#_internalSetStorageAt
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/ReentrancyGuard/ReentrancyGuard#get:_reentrancyDepth (param $0 i32) (result i32)
  local.get $0
  i32.load offset=8
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/storage/StoredU256/StoredU256#get:pointerBuffer (param $0 i32) (result i32)
  local.get $0
  i32.load
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/storage/StoredU256/StoredU256#ensureValue (param $0 i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredU256/StoredU256#get:pointerBuffer
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#getStorageAt
  local.set $1
  local.get $0
  block $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.fromUint8ArrayBE|inlined.0 (result i32)
   local.get $1
   local.set $2
   local.get $2
   call $~lib/typedarray/Uint8Array#get:length
   i32.const 32
   i32.ne
   if
    i32.const 2672
    i32.const 6032
    i32.const 220
    i32.const 30
    call $~lib/builtins/abort
    unreachable
   end
   local.get $2
   call $~lib/arraybuffer/ArrayBufferView#get:dataStart
   local.set $3
   i32.const 0
   local.get $3
   i64.load offset=24
   call $~lib/polyfills/bswap<u64>
   local.get $3
   i64.load offset=16
   call $~lib/polyfills/bswap<u64>
   local.get $3
   i64.load offset=8
   call $~lib/polyfills/bswap<u64>
   local.get $3
   i64.load
   call $~lib/polyfills/bswap<u64>
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#constructor
   br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.fromUint8ArrayBE|inlined.0
  end
  call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredU256/StoredU256#set:_value
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/storage/StoredU256/StoredU256#get:_value (param $0 i32) (result i32)
  local.get $0
  i32.load offset=12
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/storage/StoredU256/StoredU256#get:value (param $0 i32) (result i32)
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredU256/StoredU256#ensureValue
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredU256/StoredU256#get:_value
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/types/SafeMath/SafeMath.add (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  local.get $0
  local.get $1
  call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.add
  local.set $2
  local.get $2
  local.get $0
  call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.lt
  if
   i32.const 11888
   i32.const 8176
   i32.const 55
   i32.const 13
   call $~lib/builtins/abort
   unreachable
  end
  local.get $2
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/storage/StoredU256/StoredU256#get:__value (param $0 i32) (result i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  (local $10 i32)
  block $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#toUint8Array|inlined.1 (result i32)
   local.get $0
   call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredU256/StoredU256#get:_value
   local.set $1
   i32.const 1
   local.set $2
   i32.const 0
   i32.const 32
   call $~lib/typedarray/Uint8Array#constructor
   local.set $3
   local.get $1
   local.set $4
   local.get $3
   call $~lib/arraybuffer/ArrayBufferView#get:dataStart
   local.set $5
   local.get $2
   local.set $6
   local.get $6
   if
    local.get $4
    local.set $7
    local.get $5
    local.set $8
    local.get $8
    local.get $7
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi2
    call $~lib/polyfills/bswap<u64>
    i64.store
    local.get $8
    local.get $7
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi1
    call $~lib/polyfills/bswap<u64>
    i64.store offset=8
    local.get $8
    local.get $7
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo2
    call $~lib/polyfills/bswap<u64>
    i64.store offset=16
    local.get $8
    local.get $7
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo1
    call $~lib/polyfills/bswap<u64>
    i64.store offset=24
   else
    local.get $4
    local.set $9
    local.get $5
    local.set $10
    local.get $10
    local.get $9
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo1
    i64.store
    local.get $10
    local.get $9
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo2
    i64.store offset=8
    local.get $10
    local.get $9
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi1
    i64.store offset=16
    local.get $10
    local.get $9
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi2
    i64.store offset=24
   end
   local.get $3
   br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#toUint8Array|inlined.1
  end
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/storage/StoredU256/StoredU256#set:value (param $0 i32) (param $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  local.get $0
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredU256/StoredU256#set:_value
  global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
  local.set $2
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredU256/StoredU256#get:pointerBuffer
  local.set $3
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredU256/StoredU256#get:__value
  local.set $4
  local.get $2
  local.get $3
  local.get $4
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#_internalSetStorageAt
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/ReentrancyGuard/ReentrancyGuard#nonReentrantBefore (param $0 i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/ReentrancyGuard/ReentrancyGuard#get:reentrancyLevel
  global.get $~lib/@btc-vision/btc-runtime/runtime/contracts/ReentrancyGuard/ReentrancyLevel.STANDARD
  i32.eq
  if
   block $~lib/@btc-vision/btc-runtime/runtime/storage/StoredBoolean/StoredBoolean#get:value|inlined.0 (result i32)
    local.get $0
    call $~lib/@btc-vision/btc-runtime/runtime/contracts/ReentrancyGuard/ReentrancyGuard#get:_locked
    local.set $1
    local.get $1
    call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredBoolean/StoredBoolean#ensureValue
    local.get $1
    call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredBoolean/StoredBoolean#get:_value
    i32.const 0
    call $~lib/typedarray/Uint8Array#__get
    i32.const 1
    i32.eq
    br $~lib/@btc-vision/btc-runtime/runtime/storage/StoredBoolean/StoredBoolean#get:value|inlined.0
   end
   if
    local.get $0
    call $~lib/@btc-vision/btc-runtime/runtime/contracts/ReentrancyGuard/ReentrancyGuard#reentrancyGuardReentrantCall
   end
   local.get $0
   call $~lib/@btc-vision/btc-runtime/runtime/contracts/ReentrancyGuard/ReentrancyGuard#get:_locked
   i32.const 1
   call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredBoolean/StoredBoolean#set:value
  else
   local.get $0
   call $~lib/@btc-vision/btc-runtime/runtime/contracts/ReentrancyGuard/ReentrancyGuard#get:reentrancyLevel
   global.get $~lib/@btc-vision/btc-runtime/runtime/contracts/ReentrancyGuard/ReentrancyLevel.CALLBACK
   i32.eq
   if
    local.get $0
    call $~lib/@btc-vision/btc-runtime/runtime/contracts/ReentrancyGuard/ReentrancyGuard#get:_reentrancyDepth
    call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredU256/StoredU256#get:value
    local.set $2
    block $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.ge|inlined.1 (result i32)
     local.get $2
     local.set $3
     block $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.get:One|inlined.8 (result i32)
      i32.const 0
      i64.const 1
      i64.const 0
      i64.const 0
      i64.const 0
      call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#constructor
      br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.get:One|inlined.8
     end
     local.set $4
     local.get $3
     local.get $4
     call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.lt
     i32.eqz
     br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.ge|inlined.1
    end
    if
     i32.const 11792
     i32.const 11632
     i32.const 80
     i32.const 17
     call $~lib/builtins/abort
     unreachable
    end
    local.get $0
    call $~lib/@btc-vision/btc-runtime/runtime/contracts/ReentrancyGuard/ReentrancyGuard#get:_reentrancyDepth
    local.get $2
    block $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.get:One|inlined.9 (result i32)
     i32.const 0
     i64.const 1
     i64.const 0
     i64.const 0
     i64.const 0
     call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#constructor
     br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.get:One|inlined.9
    end
    call $~lib/@btc-vision/btc-runtime/runtime/types/SafeMath/SafeMath.add
    call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredU256/StoredU256#set:value
    block $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#isZero|inlined.4 (result i32)
     local.get $2
     local.set $5
     local.get $5
     call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo1
     local.get $5
     call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo2
     i64.or
     local.get $5
     call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi1
     i64.or
     local.get $5
     call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi2
     i64.or
     i64.const 0
     i64.ne
     i32.eqz
     br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#isZero|inlined.4
    end
    if
     local.get $0
     call $~lib/@btc-vision/btc-runtime/runtime/contracts/ReentrancyGuard/ReentrancyGuard#get:_locked
     i32.const 1
     call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredBoolean/StoredBoolean#set:value
    end
   end
  end
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/ReentrancyGuard/ReentrancyGuard#onExecutionStarted (param $0 i32) (param $1 i32) (param $2 i32)
  local.get $0
  local.get $1
  local.get $2
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP_NET/OP_NET#onExecutionStarted
  local.get $0
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/ReentrancyGuard/ReentrancyGuard#isSelectorExcluded@override
  if
   return
  end
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/ReentrancyGuard/ReentrancyGuard#nonReentrantBefore
 )
 (func $src/wrapped/husdt/HUSDT/HUSDT#get:_bridgeAuthority (param $0 i32) (result i32)
  local.get $0
  i32.load offset=52
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/storage/StoredAddress/StoredAddress#get:addressPointer (param $0 i32) (result i32)
  local.get $0
  i32.load
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/storage/StoredAddress/StoredAddress#get:_value (param $0 i32) (result i32)
  local.get $0
  i32.load offset=8
 )
 (func $~lib/typedarray/Uint8Array#set<~lib/typedarray/Uint8Array> (param $0 i32) (param $1 i32) (param $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  local.get $0
  local.set $3
  local.get $1
  local.set $4
  local.get $2
  local.set $5
  i32.const 0
  drop
  local.get $4
  call $~lib/typedarray/Uint8Array#get:length
  local.set $6
  local.get $5
  i32.const 0
  i32.lt_s
  if (result i32)
   i32.const 1
  else
   local.get $6
   local.get $5
   i32.add
   local.get $3
   call $~lib/typedarray/Uint8Array#get:length
   i32.gt_s
  end
  if
   i32.const 3056
   i32.const 3120
   i32.const 1902
   i32.const 5
   call $~lib/builtins/abort
   unreachable
  end
  local.get $3
  call $~lib/arraybuffer/ArrayBufferView#get:dataStart
  local.get $5
  i32.const 0
  i32.shl
  i32.add
  local.set $7
  local.get $4
  call $~lib/arraybuffer/ArrayBufferView#get:dataStart
  local.set $8
  i32.const 0
  i32.eqz
  drop
  local.get $7
  local.get $8
  local.get $6
  i32.const 0
  i32.shl
  memory.copy
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/storage/StoredAddress/StoredAddress#ensureValue (param $0 i32)
  (local $1 i32)
  global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredAddress/StoredAddress#get:addressPointer
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#getStorageAt
  local.set $1
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredAddress/StoredAddress#get:_value
  local.get $1
  i32.const 0
  call $~lib/typedarray/Uint8Array#set<~lib/typedarray/Uint8Array>
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/storage/StoredAddress/StoredAddress#get:value (param $0 i32) (result i32)
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredAddress/StoredAddress#ensureValue
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredAddress/StoredAddress#get:_value
  return
 )
 (func $src/wrapped/husdt/HUSDT/HUSDT#_getBridgeAuthority (param $0 i32) (result i32)
  local.get $0
  call $src/wrapped/husdt/HUSDT/HUSDT#get:_bridgeAuthority
  call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredAddress/StoredAddress#get:value
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:_tx (param $0 i32) (result i32)
  local.get $0
  i32.load offset=24
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/classes/Transaction/Transaction#get:sender (param $0 i32) (result i32)
  local.get $0
  i32.load offset=4
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/types/Address/Address#___get (param $0 i32) (param $1 i32) (result i32)
  local.get $1
  local.get $0
  call $~lib/typedarray/Uint8Array#get:length
  i32.ge_u
  if
   i32.const 3056
   i32.const 2928
   i32.const 357
   i32.const 13
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  call $~lib/arraybuffer/ArrayBufferView#get:dataStart
  local.get $1
  i32.add
  i32.load8_u
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/types/Address/Address#equals (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  local.get $1
  call $~lib/typedarray/Uint8Array#get:length
  local.get $0
  call $~lib/typedarray/Uint8Array#get:length
  i32.ne
  if
   i32.const 0
   return
  end
  i32.const 0
  local.set $2
  loop $for-loop|0
   local.get $2
   local.get $0
   call $~lib/typedarray/Uint8Array#get:length
   i32.lt_s
   if
    local.get $0
    local.get $2
    call $~lib/@btc-vision/btc-runtime/runtime/types/Address/Address#___get
    local.get $1
    local.get $2
    call $~lib/@btc-vision/btc-runtime/runtime/types/Address/Address#___get
    i32.ne
    if
     i32.const 0
     return
    end
    local.get $2
    i32.const 1
    i32.add
    local.set $2
    br $for-loop|0
   end
  end
  i32.const 1
  return
 )
 (func $src/wrapped/husdt/HUSDT/HUSDT#_onlyBridge (param $0 i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  local.get $0
  call $src/wrapped/husdt/HUSDT/HUSDT#_getBridgeAuthority
  local.set $1
  block $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:tx|inlined.0 (result i32)
   global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
   local.set $2
   local.get $2
   call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:_tx
   i32.eqz
   if
    i32.const 11968
    i32.const 5536
    i32.const 145
    i32.const 13
    call $~lib/builtins/abort
    unreachable
   end
   local.get $2
   call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:_tx
   local.tee $3
   if (result i32)
    local.get $3
   else
    i32.const 9408
    i32.const 5536
    i32.const 147
    i32.const 16
    call $~lib/builtins/abort
    unreachable
   end
   br $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:tx|inlined.0
  end
  call $~lib/@btc-vision/btc-runtime/runtime/env/classes/Transaction/Transaction#get:sender
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/types/Address/Address#equals
  i32.eqz
  if
   i32.const 12048
   i32.const 12112
   i32.const 116
   i32.const 13
   call $~lib/builtins/abort
   unreachable
  end
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readU256 (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  (local $10 i32)
  local.get $0
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#get:currentOffset
  global.get $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/U256_BYTE_LENGTH
  i32.add
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#verifyEnd
  block $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readBytesArray|inlined.2 (result i32)
   local.get $0
   local.set $2
   global.get $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/U256_BYTE_LENGTH
   local.set $3
   i32.const 0
   local.get $3
   call $~lib/array/Array<u8>#constructor
   local.set $4
   i32.const 0
   local.set $5
   loop $for-loop|0
    local.get $5
    local.get $3
    i32.lt_s
    if
     local.get $4
     local.get $5
     local.get $2
     call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readU8
     call $~lib/array/Array<u8>#__set
     local.get $5
     i32.const 1
     i32.add
     local.set $5
     br $for-loop|0
    end
   end
   local.get $4
   br $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readBytesArray|inlined.2
  end
  local.set $6
  local.get $1
  if (result i32)
   block $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.fromBytesBE|inlined.0 (result i32)
    local.get $6
    local.set $7
    local.get $7
    call $~lib/array/Array<u8>#get:length
    i32.const 32
    i32.ne
    if
     i32.const 2672
     i32.const 6032
     i32.const 186
     i32.const 30
     call $~lib/builtins/abort
     unreachable
    end
    local.get $7
    call $~lib/array/Array<u8>#get:dataStart
    local.set $8
    i32.const 0
    local.get $8
    i64.load offset=24
    call $~lib/polyfills/bswap<u64>
    local.get $8
    i64.load offset=16
    call $~lib/polyfills/bswap<u64>
    local.get $8
    i64.load offset=8
    call $~lib/polyfills/bswap<u64>
    local.get $8
    i64.load
    call $~lib/polyfills/bswap<u64>
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#constructor
    br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.fromBytesBE|inlined.0
   end
  else
   block $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.fromBytesLE|inlined.3 (result i32)
    local.get $6
    local.set $9
    local.get $9
    call $~lib/array/Array<u8>#get:length
    i32.const 32
    i32.ne
    if
     i32.const 2672
     i32.const 6032
     i32.const 169
     i32.const 30
     call $~lib/builtins/abort
     unreachable
    end
    local.get $9
    call $~lib/array/Array<u8>#get:dataStart
    local.set $10
    i32.const 0
    local.get $10
    i64.load
    local.get $10
    i64.load offset=8
    local.get $10
    i64.load offset=16
    local.get $10
    i64.load offset=24
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#constructor
    br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.fromBytesLE|inlined.3
   end
  end
  return
 )
 (func $src/wrapped/husdt/HUSDT/HUSDT#_requireValidAddress (param $0 i32) (param $1 i32) (param $2 i32)
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/types/Address/Address.zero
  call $~lib/@btc-vision/btc-runtime/runtime/types/Address/Address#equals
  if
   local.get $2
   i32.const 12112
   i32.const 130
   i32.const 13
   call $~lib/builtins/abort
   unreachable
  end
 )
 (func $src/wrapped/husdt/HUSDT/HUSDT#_requireNonZeroAmount (param $0 i32) (param $1 i32)
  (local $2 i32)
  block $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#isZero|inlined.5 (result i32)
   local.get $1
   local.set $2
   local.get $2
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo1
   local.get $2
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo2
   i64.or
   local.get $2
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi1
   i64.or
   local.get $2
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi2
   i64.or
   i64.const 0
   i64.ne
   i32.eqz
   br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#isZero|inlined.5
  end
  if
   i32.const 12256
   i32.const 12112
   i32.const 136
   i32.const 13
   call $~lib/builtins/abort
   unreachable
  end
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#get:balanceOfMap (param $0 i32) (result i32)
  local.get $0
  i32.load offset=24
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/memory/AddressMemoryMap/AddressMemoryMap#get:pointer (param $0 i32) (result i32)
  local.get $0
  i32.load16_u
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/memory/AddressMemoryMap/AddressMemoryMap#encodePointer (param $0 i32) (param $1 i32) (result i32)
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/memory/AddressMemoryMap/AddressMemoryMap#get:pointer
  local.get $1
  i32.const 0
  i32.const 30
  call $~lib/typedarray/Uint8Array#slice
  i32.const 1
  i32.const 12496
  call $~lib/@btc-vision/btc-runtime/runtime/math/abi/encodePointer
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/memory/AddressMemoryMap/AddressMemoryMap#getAsUint8Array (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  local.get $0
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/memory/AddressMemoryMap/AddressMemoryMap#encodePointer
  local.set $2
  global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
  local.get $2
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#getStorageAt
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/memory/AddressMemoryMap/AddressMemoryMap#get (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  local.get $0
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/memory/AddressMemoryMap/AddressMemoryMap#getAsUint8Array
  local.set $2
  block $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.fromUint8ArrayBE|inlined.1 (result i32)
   local.get $2
   local.set $3
   local.get $3
   call $~lib/typedarray/Uint8Array#get:length
   i32.const 32
   i32.ne
   if
    i32.const 2672
    i32.const 6032
    i32.const 220
    i32.const 30
    call $~lib/builtins/abort
    unreachable
   end
   local.get $3
   call $~lib/arraybuffer/ArrayBufferView#get:dataStart
   local.set $4
   i32.const 0
   local.get $4
   i64.load offset=24
   call $~lib/polyfills/bswap<u64>
   local.get $4
   i64.load offset=16
   call $~lib/polyfills/bswap<u64>
   local.get $4
   i64.load offset=8
   call $~lib/polyfills/bswap<u64>
   local.get $4
   i64.load
   call $~lib/polyfills/bswap<u64>
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#constructor
   br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.fromUint8ArrayBE|inlined.1
  end
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/memory/AddressMemoryMap/AddressMemoryMap#setAsUint8Array (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  local.get $0
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/memory/AddressMemoryMap/AddressMemoryMap#encodePointer
  local.set $3
  global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
  local.set $4
  local.get $3
  local.set $5
  local.get $2
  local.set $6
  local.get $4
  local.get $5
  local.get $6
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#_internalSetStorageAt
  local.get $0
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/memory/AddressMemoryMap/AddressMemoryMap#set (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  (local $10 i32)
  (local $11 i32)
  (local $12 i32)
  local.get $0
  local.get $1
  block $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#toUint8Array|inlined.2 (result i32)
   local.get $2
   local.set $3
   i32.const 1
   local.set $4
   i32.const 0
   i32.const 32
   call $~lib/typedarray/Uint8Array#constructor
   local.set $5
   local.get $3
   local.set $6
   local.get $5
   call $~lib/arraybuffer/ArrayBufferView#get:dataStart
   local.set $7
   local.get $4
   local.set $8
   local.get $8
   if
    local.get $6
    local.set $9
    local.get $7
    local.set $10
    local.get $10
    local.get $9
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi2
    call $~lib/polyfills/bswap<u64>
    i64.store
    local.get $10
    local.get $9
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi1
    call $~lib/polyfills/bswap<u64>
    i64.store offset=8
    local.get $10
    local.get $9
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo2
    call $~lib/polyfills/bswap<u64>
    i64.store offset=16
    local.get $10
    local.get $9
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo1
    call $~lib/polyfills/bswap<u64>
    i64.store offset=24
   else
    local.get $6
    local.set $11
    local.get $7
    local.set $12
    local.get $12
    local.get $11
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo1
    i64.store
    local.get $12
    local.get $11
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo2
    i64.store offset=8
    local.get $12
    local.get $11
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi1
    i64.store offset=16
    local.get $12
    local.get $11
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi2
    i64.store offset=24
   end
   local.get $5
   br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#toUint8Array|inlined.2
  end
  call $~lib/@btc-vision/btc-runtime/runtime/memory/AddressMemoryMap/AddressMemoryMap#setAsUint8Array
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#get:_totalSupply (param $0 i32) (result i32)
  local.get $0
  i32.load offset=16
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#get:_maxSupply (param $0 i32) (result i32)
  local.get $0
  i32.load offset=28
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeU256 (param $0 i32) (param $1 i32) (param $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  (local $10 i32)
  (local $11 i32)
  (local $12 i32)
  (local $13 i32)
  (local $14 i32)
  local.get $0
  global.get $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/U256_BYTE_LENGTH
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#allocSafe
  block $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#toUint8Array|inlined.3 (result i32)
   local.get $1
   local.set $3
   local.get $2
   local.set $4
   i32.const 0
   i32.const 32
   call $~lib/typedarray/Uint8Array#constructor
   local.set $5
   local.get $3
   local.set $6
   local.get $5
   call $~lib/arraybuffer/ArrayBufferView#get:dataStart
   local.set $7
   local.get $4
   local.set $8
   local.get $8
   if
    local.get $6
    local.set $9
    local.get $7
    local.set $10
    local.get $10
    local.get $9
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi2
    call $~lib/polyfills/bswap<u64>
    i64.store
    local.get $10
    local.get $9
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi1
    call $~lib/polyfills/bswap<u64>
    i64.store offset=8
    local.get $10
    local.get $9
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo2
    call $~lib/polyfills/bswap<u64>
    i64.store offset=16
    local.get $10
    local.get $9
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo1
    call $~lib/polyfills/bswap<u64>
    i64.store offset=24
   else
    local.get $6
    local.set $11
    local.get $7
    local.set $12
    local.get $12
    local.get $11
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo1
    i64.store
    local.get $12
    local.get $11
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo2
    i64.store offset=8
    local.get $12
    local.get $11
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi1
    i64.store offset=16
    local.get $12
    local.get $11
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi2
    i64.store offset=24
   end
   local.get $5
   br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#toUint8Array|inlined.3
  end
  local.set $13
  i32.const 0
  local.set $14
  loop $for-loop|0
   local.get $14
   global.get $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/U256_BYTE_LENGTH
   i32.lt_s
   if
    local.get $0
    local.get $13
    local.get $14
    call $~lib/typedarray/Uint8Array#__get
    call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeU8
    local.get $14
    i32.const 1
    i32.add
    local.set $14
    br $for-loop|0
   end
  end
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#bufferLength (param $0 i32) (result i32)
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#get:buffer
  call $~lib/dataview/DataView#get:byteLength
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/events/NetEvent/NetEvent#set:buffer (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store
  local.get $0
  local.get $1
  i32.const 0
  call $~lib/rt/stub/__link
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/events/NetEvent/NetEvent#set:eventType (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=4
  local.get $0
  local.get $1
  i32.const 0
  call $~lib/rt/stub/__link
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/events/NetEvent/NetEvent#set:data (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=8
  local.get $0
  local.get $1
  i32.const 0
  call $~lib/rt/stub/__link
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/events/NetEvent/NetEvent#constructor (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  local.get $0
  i32.eqz
  if
   i32.const 12
   i32.const 55
   call $~lib/rt/stub/__new
   local.set $0
  end
  local.get $0
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/events/NetEvent/NetEvent#set:eventType
  local.get $0
  local.get $2
  call $~lib/@btc-vision/btc-runtime/runtime/events/NetEvent/NetEvent#set:data
  local.get $0
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/events/NetEvent/NetEvent#set:buffer
  local.get $2
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#bufferLength
  global.get $~lib/@btc-vision/btc-runtime/runtime/events/NetEvent/MAX_EVENT_DATA_SIZE
  i32.gt_u
  if
   i32.const 12624
   i32.const 12736
   i32.const 14
   i32.const 13
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  local.get $2
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#getBuffer
  call $~lib/@btc-vision/btc-runtime/runtime/events/NetEvent/NetEvent#set:buffer
  local.get $0
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/events/predefined/MintedEvent/MintedEvent#constructor (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  (local $3 i32)
  local.get $0
  i32.eqz
  if
   i32.const 12
   i32.const 56
   call $~lib/rt/stub/__new
   local.set $0
  end
  i32.const 0
  global.get $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/ADDRESS_BYTE_LENGTH
  global.get $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/U256_BYTE_LENGTH
  i32.add
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#constructor
  local.set $3
  local.get $3
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeAddress
  local.get $3
  local.get $2
  i32.const 1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeU256
  local.get $0
  i32.const 12880
  local.get $3
  call $~lib/@btc-vision/btc-runtime/runtime/events/NetEvent/NetEvent#constructor
  local.set $0
  local.get $0
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/events/NetEvent/NetEvent#get:buffer (param $0 i32) (result i32)
  local.get $0
  i32.load
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/events/NetEvent/NetEvent#get:length (param $0 i32) (result i32)
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/events/NetEvent/NetEvent#get:buffer
  i32.eqz
  if
   i32.const 12912
   i32.const 12736
   i32.const 22
   i32.const 13
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/events/NetEvent/NetEvent#get:buffer
  call $~lib/arraybuffer/ArrayBufferView#get:byteLength
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/events/NetEvent/NetEvent#getEventData (param $0 i32) (result i32)
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/events/NetEvent/NetEvent#get:buffer
  i32.eqz
  if
   i32.const 12912
   i32.const 12736
   i32.const 30
   i32.const 13
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/events/NetEvent/NetEvent#get:buffer
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/events/NetEvent/NetEvent#get:eventType (param $0 i32) (result i32)
  local.get $0
  i32.load offset=4
 )
 (func $~lib/string/String.UTF8.encodeUnsafe@varargs (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32) (param $4 i32) (result i32)
  block $2of2
   block $1of2
    block $0of2
     block $outOfRange
      global.get $~argumentsLength
      i32.const 3
      i32.sub
      br_table $0of2 $1of2 $2of2 $outOfRange
     end
     unreachable
    end
    i32.const 0
    local.set $3
   end
   i32.const 0
   local.set $4
  end
  local.get $0
  local.get $1
  local.get $2
  local.get $3
  local.get $4
  call $~lib/string/String.UTF8.encodeUnsafe
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#emit (param $0 i32) (param $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/events/NetEvent/NetEvent#getEventData
  local.set $2
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/events/NetEvent/NetEvent#get:eventType
  local.set $3
  local.get $3
  i32.const 0
  call $~lib/string/String.UTF8.byteLength
  local.set $4
  i32.const 8
  local.get $4
  i32.add
  local.get $2
  call $~lib/typedarray/Uint8Array#get:length
  i32.add
  local.set $5
  i32.const 0
  local.get $5
  call $~lib/typedarray/Uint8Array#constructor
  local.set $6
  local.get $6
  call $~lib/arraybuffer/ArrayBufferView#get:dataStart
  local.set $7
  local.get $7
  local.get $4
  call $~lib/polyfills/bswap<u32>
  i32.store
  local.get $3
  local.get $3
  call $~lib/string/String#get:length
  local.get $7
  i32.const 4
  i32.add
  i32.const 0
  i32.const 3
  global.set $~argumentsLength
  i32.const 0
  call $~lib/string/String.UTF8.encodeUnsafe@varargs
  drop
  i32.const 4
  local.get $4
  i32.add
  local.set $8
  local.get $7
  local.get $8
  i32.add
  local.get $2
  call $~lib/typedarray/Uint8Array#get:length
  call $~lib/polyfills/bswap<u32>
  i32.store
  local.get $7
  local.get $8
  i32.add
  i32.const 4
  i32.add
  local.get $2
  call $~lib/arraybuffer/ArrayBufferView#get:dataStart
  local.get $2
  call $~lib/typedarray/Uint8Array#get:length
  memory.copy
  local.get $6
  call $~lib/arraybuffer/ArrayBufferView#get:buffer
  local.get $5
  call $~lib/@btc-vision/btc-runtime/runtime/env/global/emit
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP_NET/OP_NET#emitEvent (param $0 i32) (param $1 i32)
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/events/NetEvent/NetEvent#get:length
  global.get $~lib/@btc-vision/btc-runtime/runtime/events/NetEvent/MAX_EVENT_DATA_SIZE
  i32.gt_u
  if
   i32.const 12624
   i32.const 11088
   i32.const 115
   i32.const 13
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#emit
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#createMintedEvent (param $0 i32) (param $1 i32) (param $2 i32)
  local.get $0
  i32.const 0
  local.get $1
  local.get $2
  call $~lib/@btc-vision/btc-runtime/runtime/events/predefined/MintedEvent/MintedEvent#constructor
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP_NET/OP_NET#emitEvent
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#_mint (param $0 i32) (param $1 i32) (param $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  (local $10 i32)
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/types/Address/Address.zero
  call $~lib/@btc-vision/btc-runtime/runtime/types/Address/Address#equals
  if
   i32.const 12304
   i32.const 12368
   i32.const 915
   i32.const 13
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#get:balanceOfMap
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/memory/AddressMemoryMap/AddressMemoryMap#get
  local.set $3
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#get:balanceOfMap
  local.get $1
  local.get $3
  local.get $2
  call $~lib/@btc-vision/btc-runtime/runtime/types/SafeMath/SafeMath.add
  call $~lib/@btc-vision/btc-runtime/runtime/memory/AddressMemoryMap/AddressMemoryMap#set
  drop
  local.get $0
  block $~lib/@btc-vision/btc-runtime/runtime/storage/StoredU256/StoredU256#add|inlined.0 (result i32)
   local.get $0
   call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#get:_totalSupply
   local.set $4
   local.get $2
   local.set $5
   local.get $4
   call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredU256/StoredU256#ensureValue
   local.get $4
   local.get $4
   call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredU256/StoredU256#get:_value
   local.get $5
   call $~lib/@btc-vision/btc-runtime/runtime/types/SafeMath/SafeMath.add
   call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredU256/StoredU256#set:_value
   global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
   local.set $6
   local.get $4
   call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredU256/StoredU256#get:pointerBuffer
   local.set $7
   local.get $4
   call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredU256/StoredU256#get:__value
   local.set $8
   local.get $6
   local.get $7
   local.get $8
   call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#_internalSetStorageAt
   local.get $4
   br $~lib/@btc-vision/btc-runtime/runtime/storage/StoredU256/StoredU256#add|inlined.0
  end
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#set:_totalSupply
  block $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.gt|inlined.0 (result i32)
   local.get $0
   call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#get:_totalSupply
   call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredU256/StoredU256#get:value
   local.set $9
   local.get $0
   call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#get:_maxSupply
   call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredU256/StoredU256#get:value
   local.set $10
   local.get $10
   local.get $9
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.lt
   br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.gt|inlined.0
  end
  if
   i32.const 12560
   i32.const 12368
   i32.const 925
   i32.const 13
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  local.get $1
  local.get $2
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#createMintedEvent
 )
 (func $src/wrapped/events/BridgeWrappedTokenEvents/BridgeMintedEvent#constructor (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32) (result i32)
  (local $4 i32)
  local.get $0
  i32.eqz
  if
   i32.const 12
   i32.const 57
   call $~lib/rt/stub/__new
   local.set $0
  end
  i32.const 0
  global.get $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/ADDRESS_BYTE_LENGTH
  i32.const 2
  i32.mul
  global.get $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/U256_BYTE_LENGTH
  i32.add
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#constructor
  local.set $4
  local.get $4
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeAddress
  local.get $4
  local.get $2
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeAddress
  local.get $4
  local.get $3
  i32.const 1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeU256
  local.get $0
  i32.const 12976
  local.get $4
  call $~lib/@btc-vision/btc-runtime/runtime/events/NetEvent/NetEvent#constructor
  local.set $0
  local.get $0
 )
 (func $src/wrapped/husdt/HUSDT/HUSDT#mint (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  local.get $0
  call $src/wrapped/husdt/HUSDT/HUSDT#_onlyBridge
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readAddress
  local.set $2
  local.get $1
  i32.const 1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readU256
  local.set $3
  local.get $0
  local.get $2
  i32.const 12192
  call $src/wrapped/husdt/HUSDT/HUSDT#_requireValidAddress
  local.get $0
  local.get $3
  call $src/wrapped/husdt/HUSDT/HUSDT#_requireNonZeroAmount
  local.get $0
  local.get $2
  local.get $3
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#_mint
  local.get $0
  i32.const 0
  block $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:tx|inlined.1 (result i32)
   global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
   local.set $4
   local.get $4
   call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:_tx
   i32.eqz
   if
    i32.const 11968
    i32.const 5536
    i32.const 145
    i32.const 13
    call $~lib/builtins/abort
    unreachable
   end
   local.get $4
   call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:_tx
   local.tee $5
   if (result i32)
    local.get $5
   else
    i32.const 9408
    i32.const 5536
    i32.const 147
    i32.const 16
    call $~lib/builtins/abort
    unreachable
   end
   br $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:tx|inlined.1
  end
  call $~lib/@btc-vision/btc-runtime/runtime/env/classes/Transaction/Transaction#get:sender
  local.get $2
  local.get $3
  call $src/wrapped/events/BridgeWrappedTokenEvents/BridgeMintedEvent#constructor
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP_NET/OP_NET#emitEvent
  i32.const 0
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#constructor
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#hasStorageAt (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  (local $10 i32)
  (local $11 i32)
  (local $12 i32)
  (local $13 i32)
  (local $14 i32)
  (local $15 i32)
  local.get $0
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#getStorageAt
  local.set $2
  block $~lib/@btc-vision/btc-runtime/runtime/generic/MapUint8Array/eqUint|inlined.1 (result i32)
   local.get $2
   local.set $3
   global.get $~lib/@btc-vision/btc-runtime/runtime/math/bytes/EMPTY_BUFFER
   local.set $4
   local.get $3
   call $~lib/typedarray/Uint8Array#get:length
   local.get $4
   call $~lib/typedarray/Uint8Array#get:length
   i32.ne
   if
    i32.const 0
    br $~lib/@btc-vision/btc-runtime/runtime/generic/MapUint8Array/eqUint|inlined.1
   end
   block $~lib/memory/memory.compare|inlined.4 (result i32)
    local.get $3
    call $~lib/arraybuffer/ArrayBufferView#get:dataStart
    local.set $5
    local.get $4
    call $~lib/arraybuffer/ArrayBufferView#get:dataStart
    local.set $6
    local.get $3
    call $~lib/typedarray/Uint8Array#get:length
    local.set $7
    block $~lib/util/memory/memcmp|inlined.4 (result i32)
     local.get $5
     local.set $8
     local.get $6
     local.set $9
     local.get $7
     local.set $10
     local.get $8
     local.get $9
     i32.eq
     if
      i32.const 0
      br $~lib/util/memory/memcmp|inlined.4
     end
     i32.const 0
     i32.const 2
     i32.lt_s
     drop
     local.get $8
     i32.const 7
     i32.and
     local.get $9
     i32.const 7
     i32.and
     i32.eq
     if
      loop $while-continue|0
       local.get $8
       i32.const 7
       i32.and
       if
        local.get $10
        i32.eqz
        if
         i32.const 0
         br $~lib/util/memory/memcmp|inlined.4
        end
        local.get $8
        i32.load8_u
        local.set $11
        local.get $9
        i32.load8_u
        local.set $12
        local.get $11
        local.get $12
        i32.ne
        if
         local.get $11
         local.get $12
         i32.sub
         br $~lib/util/memory/memcmp|inlined.4
        end
        local.get $10
        i32.const 1
        i32.sub
        local.set $10
        local.get $8
        i32.const 1
        i32.add
        local.set $8
        local.get $9
        i32.const 1
        i32.add
        local.set $9
        br $while-continue|0
       end
      end
      block $while-break|1
       loop $while-continue|1
        local.get $10
        i32.const 8
        i32.ge_u
        if
         local.get $8
         i64.load
         local.get $9
         i64.load
         i64.ne
         if
          br $while-break|1
         end
         local.get $8
         i32.const 8
         i32.add
         local.set $8
         local.get $9
         i32.const 8
         i32.add
         local.set $9
         local.get $10
         i32.const 8
         i32.sub
         local.set $10
         br $while-continue|1
        end
       end
      end
     end
     loop $while-continue|2
      local.get $10
      local.tee $13
      i32.const 1
      i32.sub
      local.set $10
      local.get $13
      if
       local.get $8
       i32.load8_u
       local.set $14
       local.get $9
       i32.load8_u
       local.set $15
       local.get $14
       local.get $15
       i32.ne
       if
        local.get $14
        local.get $15
        i32.sub
        br $~lib/util/memory/memcmp|inlined.4
       end
       local.get $8
       i32.const 1
       i32.add
       local.set $8
       local.get $9
       i32.const 1
       i32.add
       local.set $9
       br $while-continue|2
      end
     end
     i32.const 0
     br $~lib/util/memory/memcmp|inlined.4
    end
    br $~lib/memory/memory.compare|inlined.4
   end
   i32.const 0
   i32.eq
   br $~lib/@btc-vision/btc-runtime/runtime/generic/MapUint8Array/eqUint|inlined.1
  end
  i32.eqz
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/memory/AddressMemoryMap/AddressMemoryMap#has (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  local.get $0
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/memory/AddressMemoryMap/AddressMemoryMap#encodePointer
  local.set $2
  global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
  local.get $2
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#hasStorageAt
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#_balanceOf (param $0 i32) (param $1 i32) (result i32)
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#get:balanceOfMap
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/memory/AddressMemoryMap/AddressMemoryMap#has
  i32.eqz
  if
   block $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.get:Zero|inlined.13 (result i32)
    i32.const 0
    i64.const 0
    i64.const 0
    i64.const 0
    i64.const 0
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#constructor
    br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.get:Zero|inlined.13
   end
   return
  end
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#get:balanceOfMap
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/memory/AddressMemoryMap/AddressMemoryMap#get
  return
 )
 (func $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.sub (param $0 i32) (param $1 i32) (result i32)
  (local $2 i64)
  (local $3 i64)
  (local $4 i64)
  (local $5 i64)
  (local $6 i32)
  (local $7 i64)
  (local $8 i64)
  (local $9 i64)
  (local $10 i64)
  (local $11 i64)
  (local $12 i64)
  (local $13 i64)
  (local $14 i32)
  (local $15 i64)
  (local $16 i64)
  (local $17 i64)
  (local $18 i64)
  (local $19 i64)
  (local $20 i64)
  (local $21 i64)
  (local $22 i32)
  (local $23 i64)
  (local $24 i64)
  (local $25 i64)
  (local $26 i64)
  (local $27 i64)
  (local $28 i64)
  (local $29 i64)
  (local $30 i32)
  (local $31 i64)
  (local $32 i64)
  block $~lib/@btc-vision/as-bignum/assembly/globals/sub64|inlined.4 (result i64)
   local.get $0
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo1
   local.set $2
   local.get $1
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo1
   local.set $3
   i64.const 0
   local.set $4
   local.get $2
   local.get $3
   i64.sub
   local.set $5
   local.get $5
   local.get $2
   i64.gt_u
   if (result i32)
    i32.const 1
   else
    i32.const 0
   end
   local.set $6
   local.get $5
   local.get $4
   i64.sub
   local.set $7
   local.get $6
   local.get $7
   local.get $5
   i64.gt_u
   if (result i32)
    i32.const 1
   else
    i32.const 0
   end
   i32.add
   local.set $6
   local.get $6
   i64.extend_i32_s
   global.set $~lib/@btc-vision/as-bignum/assembly/globals/__u256carrySub
   local.get $7
   br $~lib/@btc-vision/as-bignum/assembly/globals/sub64|inlined.4
  end
  local.set $8
  global.get $~lib/@btc-vision/as-bignum/assembly/globals/__u256carrySub
  local.set $9
  block $~lib/@btc-vision/as-bignum/assembly/globals/sub64|inlined.5 (result i64)
   local.get $0
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo2
   local.set $10
   local.get $1
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo2
   local.set $11
   local.get $9
   local.set $12
   local.get $10
   local.get $11
   i64.sub
   local.set $13
   local.get $13
   local.get $10
   i64.gt_u
   if (result i32)
    i32.const 1
   else
    i32.const 0
   end
   local.set $14
   local.get $13
   local.get $12
   i64.sub
   local.set $15
   local.get $14
   local.get $15
   local.get $13
   i64.gt_u
   if (result i32)
    i32.const 1
   else
    i32.const 0
   end
   i32.add
   local.set $14
   local.get $14
   i64.extend_i32_s
   global.set $~lib/@btc-vision/as-bignum/assembly/globals/__u256carrySub
   local.get $15
   br $~lib/@btc-vision/as-bignum/assembly/globals/sub64|inlined.5
  end
  local.set $16
  global.get $~lib/@btc-vision/as-bignum/assembly/globals/__u256carrySub
  local.set $17
  block $~lib/@btc-vision/as-bignum/assembly/globals/sub64|inlined.6 (result i64)
   local.get $0
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi1
   local.set $18
   local.get $1
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi1
   local.set $19
   local.get $17
   local.set $20
   local.get $18
   local.get $19
   i64.sub
   local.set $21
   local.get $21
   local.get $18
   i64.gt_u
   if (result i32)
    i32.const 1
   else
    i32.const 0
   end
   local.set $22
   local.get $21
   local.get $20
   i64.sub
   local.set $23
   local.get $22
   local.get $23
   local.get $21
   i64.gt_u
   if (result i32)
    i32.const 1
   else
    i32.const 0
   end
   i32.add
   local.set $22
   local.get $22
   i64.extend_i32_s
   global.set $~lib/@btc-vision/as-bignum/assembly/globals/__u256carrySub
   local.get $23
   br $~lib/@btc-vision/as-bignum/assembly/globals/sub64|inlined.6
  end
  local.set $24
  global.get $~lib/@btc-vision/as-bignum/assembly/globals/__u256carrySub
  local.set $25
  block $~lib/@btc-vision/as-bignum/assembly/globals/sub64|inlined.7 (result i64)
   local.get $0
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi2
   local.set $26
   local.get $1
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi2
   local.set $27
   local.get $25
   local.set $28
   local.get $26
   local.get $27
   i64.sub
   local.set $29
   local.get $29
   local.get $26
   i64.gt_u
   if (result i32)
    i32.const 1
   else
    i32.const 0
   end
   local.set $30
   local.get $29
   local.get $28
   i64.sub
   local.set $31
   local.get $30
   local.get $31
   local.get $29
   i64.gt_u
   if (result i32)
    i32.const 1
   else
    i32.const 0
   end
   i32.add
   local.set $30
   local.get $30
   i64.extend_i32_s
   global.set $~lib/@btc-vision/as-bignum/assembly/globals/__u256carrySub
   local.get $31
   br $~lib/@btc-vision/as-bignum/assembly/globals/sub64|inlined.7
  end
  local.set $32
  i32.const 0
  local.get $8
  local.get $16
  local.get $24
  local.get $32
  call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#constructor
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/types/SafeMath/SafeMath.sub (param $0 i32) (param $1 i32) (result i32)
  local.get $0
  local.get $1
  call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.lt
  if
   i32.const 13200
   i32.const 8176
   i32.const 125
   i32.const 13
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  local.get $1
  call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.sub
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/events/predefined/BurnedEvent/BurnedEvent#constructor (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  (local $3 i32)
  local.get $0
  i32.eqz
  if
   i32.const 12
   i32.const 58
   call $~lib/rt/stub/__new
   local.set $0
  end
  i32.const 0
  global.get $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/ADDRESS_BYTE_LENGTH
  global.get $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/U256_BYTE_LENGTH
  i32.add
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#constructor
  local.set $3
  local.get $3
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeAddress
  local.get $3
  local.get $2
  i32.const 1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeU256
  local.get $0
  i32.const 13296
  local.get $3
  call $~lib/@btc-vision/btc-runtime/runtime/events/NetEvent/NetEvent#constructor
  local.set $0
  local.get $0
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#createBurnedEvent (param $0 i32) (param $1 i32) (param $2 i32)
  local.get $0
  i32.const 0
  local.get $1
  local.get $2
  call $~lib/@btc-vision/btc-runtime/runtime/events/predefined/BurnedEvent/BurnedEvent#constructor
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP_NET/OP_NET#emitEvent
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#_burn (param $0 i32) (param $1 i32) (param $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/types/Address/Address.zero
  call $~lib/@btc-vision/btc-runtime/runtime/types/Address/Address#equals
  if
   i32.const 13152
   i32.const 12368
   i32.const 937
   i32.const 13
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#get:balanceOfMap
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/memory/AddressMemoryMap/AddressMemoryMap#get
  local.set $3
  local.get $3
  local.get $2
  call $~lib/@btc-vision/btc-runtime/runtime/types/SafeMath/SafeMath.sub
  local.set $4
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#get:balanceOfMap
  local.get $1
  local.get $4
  call $~lib/@btc-vision/btc-runtime/runtime/memory/AddressMemoryMap/AddressMemoryMap#set
  drop
  local.get $0
  block $~lib/@btc-vision/btc-runtime/runtime/storage/StoredU256/StoredU256#sub|inlined.0 (result i32)
   local.get $0
   call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#get:_totalSupply
   local.set $5
   local.get $2
   local.set $6
   local.get $5
   call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredU256/StoredU256#ensureValue
   local.get $5
   local.get $5
   call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredU256/StoredU256#get:_value
   local.get $6
   call $~lib/@btc-vision/btc-runtime/runtime/types/SafeMath/SafeMath.sub
   call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredU256/StoredU256#set:_value
   global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
   local.set $7
   local.get $5
   call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredU256/StoredU256#get:pointerBuffer
   local.set $8
   local.get $5
   call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredU256/StoredU256#get:__value
   local.set $9
   local.get $7
   local.get $8
   local.get $9
   call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#_internalSetStorageAt
   local.get $5
   br $~lib/@btc-vision/btc-runtime/runtime/storage/StoredU256/StoredU256#sub|inlined.0
  end
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#set:_totalSupply
  local.get $0
  local.get $1
  local.get $2
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#createBurnedEvent
 )
 (func $src/wrapped/events/BridgeWrappedTokenEvents/BridgeBurnedEvent#constructor (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32) (result i32)
  (local $4 i32)
  local.get $0
  i32.eqz
  if
   i32.const 12
   i32.const 59
   call $~lib/rt/stub/__new
   local.set $0
  end
  i32.const 0
  global.get $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/ADDRESS_BYTE_LENGTH
  i32.const 2
  i32.mul
  global.get $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/U256_BYTE_LENGTH
  i32.add
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#constructor
  local.set $4
  local.get $4
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeAddress
  local.get $4
  local.get $2
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeAddress
  local.get $4
  local.get $3
  i32.const 1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeU256
  local.get $0
  i32.const 13328
  local.get $4
  call $~lib/@btc-vision/btc-runtime/runtime/events/NetEvent/NetEvent#constructor
  local.set $0
  local.get $0
 )
 (func $src/wrapped/husdt/HUSDT/HUSDT#burnFrom (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  local.get $0
  call $src/wrapped/husdt/HUSDT/HUSDT#_onlyBridge
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readAddress
  local.set $2
  local.get $1
  i32.const 1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readU256
  local.set $3
  local.get $0
  local.get $2
  i32.const 13024
  call $src/wrapped/husdt/HUSDT/HUSDT#_requireValidAddress
  local.get $0
  local.get $3
  call $src/wrapped/husdt/HUSDT/HUSDT#_requireNonZeroAmount
  local.get $0
  local.get $2
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#_balanceOf
  local.set $4
  local.get $4
  local.get $3
  call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.lt
  if
   i32.const 13088
   i32.const 12112
   i32.const 80
   i32.const 13
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  local.get $2
  local.get $3
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#_burn
  local.get $0
  i32.const 0
  block $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:tx|inlined.2 (result i32)
   global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
   local.set $5
   local.get $5
   call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:_tx
   i32.eqz
   if
    i32.const 11968
    i32.const 5536
    i32.const 145
    i32.const 13
    call $~lib/builtins/abort
    unreachable
   end
   local.get $5
   call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:_tx
   local.tee $6
   if (result i32)
    local.get $6
   else
    i32.const 9408
    i32.const 5536
    i32.const 147
    i32.const 16
    call $~lib/builtins/abort
    unreachable
   end
   br $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:tx|inlined.2
  end
  call $~lib/@btc-vision/btc-runtime/runtime/env/classes/Transaction/Transaction#get:sender
  local.get $2
  local.get $3
  call $src/wrapped/events/BridgeWrappedTokenEvents/BridgeBurnedEvent#constructor
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP_NET/OP_NET#emitEvent
  i32.const 0
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#constructor
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/storage/StoredAddress/StoredAddress#set:value (param $0 i32) (param $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  local.get $1
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredAddress/StoredAddress#get:value
  call $~lib/@btc-vision/btc-runtime/runtime/types/Address/Address#equals
  if
   return
  end
  local.get $0
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredAddress/StoredAddress#set:_value
  global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
  local.set $2
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredAddress/StoredAddress#get:addressPointer
  local.set $3
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredAddress/StoredAddress#get:_value
  local.set $4
  local.get $2
  local.get $3
  local.get $4
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#_internalSetStorageAt
 )
 (func $src/wrapped/husdt/HUSDT/HUSDT#_setBridgeAuthority (param $0 i32) (param $1 i32)
  local.get $0
  call $src/wrapped/husdt/HUSDT/HUSDT#get:_bridgeAuthority
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredAddress/StoredAddress#set:value
 )
 (func $src/wrapped/events/BridgeWrappedTokenEvents/BridgeAuthorityChangedEvent#constructor (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  (local $3 i32)
  local.get $0
  i32.eqz
  if
   i32.const 12
   i32.const 60
   call $~lib/rt/stub/__new
   local.set $0
  end
  i32.const 0
  global.get $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/ADDRESS_BYTE_LENGTH
  i32.const 2
  i32.mul
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#constructor
  local.set $3
  local.get $3
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeAddress
  local.get $3
  local.get $2
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeAddress
  local.get $0
  i32.const 13456
  local.get $3
  call $~lib/@btc-vision/btc-runtime/runtime/events/NetEvent/NetEvent#constructor
  local.set $0
  local.get $0
 )
 (func $src/wrapped/husdt/HUSDT/HUSDT#setBridgeAuthority (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  local.get $0
  call $src/wrapped/husdt/HUSDT/HUSDT#_onlyBridge
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readAddress
  local.set $2
  local.get $0
  local.get $2
  i32.const 13376
  call $src/wrapped/husdt/HUSDT/HUSDT#_requireValidAddress
  local.get $0
  call $src/wrapped/husdt/HUSDT/HUSDT#_getBridgeAuthority
  local.set $3
  local.get $0
  local.get $2
  call $src/wrapped/husdt/HUSDT/HUSDT#_setBridgeAuthority
  local.get $0
  i32.const 0
  local.get $3
  local.get $2
  call $src/wrapped/events/BridgeWrappedTokenEvents/BridgeAuthorityChangedEvent#constructor
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP_NET/OP_NET#emitEvent
  i32.const 0
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#constructor
  return
 )
 (func $src/wrapped/husdt/HUSDT/HUSDT#bridgeAuthority (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  i32.const 0
  i32.const 32
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#constructor
  local.set $2
  local.get $2
  local.get $0
  call $src/wrapped/husdt/HUSDT/HUSDT#_getBridgeAuthority
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeAddress
  local.get $2
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#get:_name (param $0 i32) (result i32)
  local.get $0
  i32.load offset=36
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/storage/BaseStoredString/BaseStoredString#get:_value (param $0 i32) (result i32)
  local.get $0
  i32.load offset=12
 )
 (func $~lib/string/String.__not (param $0 i32) (result i32)
  local.get $0
  i32.const 0
  i32.eq
  if (result i32)
   i32.const 1
  else
   local.get $0
   call $~lib/string/String#get:length
   i32.eqz
  end
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/storage/BaseStoredString/BaseStoredString#getClassName (param $0 i32) (result i32)
  unreachable
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/storage/BaseStoredString/BaseStoredString#get:pointer (param $0 i32) (result i32)
  local.get $0
  i32.load16_u offset=8
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/storage/BaseStoredString/BaseStoredString#get:subPointer (param $0 i32) (result i32)
  local.get $0
  i32.load offset=4
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/storage/BaseStoredString/BaseStoredString#getPointer (param $0 i32) (param $1 i64) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i64)
  (local $6 i64)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  (local $10 i32)
  (local $11 i32)
  (local $12 i32)
  (local $13 i32)
  (local $14 i32)
  (local $15 i32)
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/storage/BaseStoredString/BaseStoredString#getClassName@override
  local.set $2
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/storage/BaseStoredString/BaseStoredString#get:pointer
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/storage/BaseStoredString/BaseStoredString#get:subPointer
  i32.const 1
  local.get $2
  call $~lib/@btc-vision/btc-runtime/runtime/math/abi/encodePointer
  local.set $3
  block $~lib/@btc-vision/btc-runtime/runtime/math/bytes/bigEndianAdd|inlined.0 (result i32)
   local.get $3
   local.set $4
   local.get $1
   local.set $5
   local.get $4
   call $~lib/typedarray/Uint8Array#get:length
   i32.const 32
   i32.ne
   if
    i32.const 13520
    i32.const 10112
    i32.const 163
    i32.const 9
    call $~lib/builtins/abort
    unreachable
   end
   block $~lib/@btc-vision/btc-runtime/runtime/math/bytes/u64ToBE32Bytes|inlined.0 (result i32)
    local.get $5
    local.set $6
    i32.const 0
    i32.const 32
    call $~lib/typedarray/Uint8Array#constructor
    local.set $7
    i32.const 0
    local.set $8
    loop $for-loop|0
     local.get $8
     i32.const 8
     i32.lt_s
     if
      local.get $7
      i32.const 31
      local.get $8
      i32.sub
      local.get $6
      i64.const 255
      i64.and
      i32.wrap_i64
      i32.const 255
      i32.and
      call $~lib/typedarray/Uint8Array#__set
      local.get $6
      i64.const 8
      i64.shr_u
      local.set $6
      local.get $8
      i32.const 1
      i32.add
      local.set $8
      br $for-loop|0
     end
    end
    local.get $7
    br $~lib/@btc-vision/btc-runtime/runtime/math/bytes/u64ToBE32Bytes|inlined.0
   end
   local.set $9
   block $~lib/@btc-vision/btc-runtime/runtime/math/bytes/addUint8ArraysBE|inlined.0 (result i32)
    local.get $4
    local.set $10
    local.get $9
    local.set $11
    local.get $10
    call $~lib/typedarray/Uint8Array#get:length
    i32.const 32
    i32.ne
    if (result i32)
     i32.const 1
    else
     local.get $11
     call $~lib/typedarray/Uint8Array#get:length
     i32.const 32
     i32.ne
    end
    if
     i32.const 13616
     i32.const 10112
     i32.const 48
     i32.const 9
     call $~lib/builtins/abort
     unreachable
    end
    i32.const 0
    i32.const 32
    call $~lib/typedarray/Uint8Array#constructor
    local.set $12
    i32.const 0
    local.set $13
    i32.const 31
    local.set $14
    loop $for-loop|1
     local.get $14
     i32.const 0
     i32.ge_s
     if
      local.get $10
      local.get $14
      call $~lib/typedarray/Uint8Array#__get
      local.get $11
      local.get $14
      call $~lib/typedarray/Uint8Array#__get
      i32.add
      local.get $13
      i32.add
      local.set $15
      local.get $12
      local.get $14
      local.get $15
      i32.const 255
      i32.and
      call $~lib/typedarray/Uint8Array#__set
      local.get $15
      i32.const 8
      i32.shr_u
      local.set $13
      local.get $14
      i32.const 1
      i32.sub
      local.set $14
      br $for-loop|1
     end
    end
    local.get $12
    br $~lib/@btc-vision/btc-runtime/runtime/math/bytes/addUint8ArraysBE|inlined.0
   end
   br $~lib/@btc-vision/btc-runtime/runtime/math/bytes/bigEndianAdd|inlined.0
  end
  return
 )
 (func $~lib/string/String.UTF8.decodeUnsafe (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  (local $10 i32)
  (local $11 i32)
  local.get $0
  local.set $3
  local.get $0
  local.get $1
  i32.add
  local.set $4
  local.get $4
  local.get $3
  i32.ge_u
  i32.eqz
  if
   i32.const 0
   i32.const 8624
   i32.const 770
   i32.const 7
   call $~lib/builtins/abort
   unreachable
  end
  local.get $1
  i32.const 1
  i32.shl
  i32.const 2
  call $~lib/rt/stub/__new
  local.set $5
  local.get $5
  local.set $6
  block $while-break|0
   loop $while-continue|0
    local.get $3
    local.get $4
    i32.lt_u
    if
     local.get $3
     i32.load8_u
     local.set $7
     local.get $3
     i32.const 1
     i32.add
     local.set $3
     local.get $7
     i32.const 128
     i32.and
     i32.eqz
     if
      local.get $2
      local.get $7
      i32.eqz
      i32.and
      if
       br $while-break|0
      end
      local.get $6
      local.get $7
      i32.store16
     else
      local.get $4
      local.get $3
      i32.eq
      if
       br $while-break|0
      end
      local.get $3
      i32.load8_u
      i32.const 63
      i32.and
      local.set $8
      local.get $3
      i32.const 1
      i32.add
      local.set $3
      local.get $7
      i32.const 224
      i32.and
      i32.const 192
      i32.eq
      if
       local.get $6
       local.get $7
       i32.const 31
       i32.and
       i32.const 6
       i32.shl
       local.get $8
       i32.or
       i32.store16
      else
       local.get $4
       local.get $3
       i32.eq
       if
        br $while-break|0
       end
       local.get $3
       i32.load8_u
       i32.const 63
       i32.and
       local.set $9
       local.get $3
       i32.const 1
       i32.add
       local.set $3
       local.get $7
       i32.const 240
       i32.and
       i32.const 224
       i32.eq
       if
        local.get $7
        i32.const 15
        i32.and
        i32.const 12
        i32.shl
        local.get $8
        i32.const 6
        i32.shl
        i32.or
        local.get $9
        i32.or
        local.set $7
       else
        local.get $4
        local.get $3
        i32.eq
        if
         br $while-break|0
        end
        local.get $7
        i32.const 7
        i32.and
        i32.const 18
        i32.shl
        local.get $8
        i32.const 12
        i32.shl
        i32.or
        local.get $9
        i32.const 6
        i32.shl
        i32.or
        local.get $3
        i32.load8_u
        i32.const 63
        i32.and
        i32.or
        local.set $7
        local.get $3
        i32.const 1
        i32.add
        local.set $3
       end
       local.get $7
       i32.const 65536
       i32.lt_u
       if
        local.get $6
        local.get $7
        i32.store16
       else
        local.get $7
        i32.const 65536
        i32.sub
        local.set $7
        local.get $7
        i32.const 10
        i32.shr_u
        i32.const 55296
        i32.or
        local.set $10
        local.get $7
        i32.const 1023
        i32.and
        i32.const 56320
        i32.or
        local.set $11
        local.get $6
        local.get $10
        local.get $11
        i32.const 16
        i32.shl
        i32.or
        i32.store
        local.get $6
        i32.const 2
        i32.add
        local.set $6
       end
      end
     end
     local.get $6
     i32.const 2
     i32.add
     local.set $6
     br $while-continue|0
    end
   end
  end
  local.get $5
  local.get $6
  local.get $5
  i32.sub
  call $~lib/rt/stub/__renew
  return
 )
 (func $~lib/string/String.UTF8.decode (param $0 i32) (param $1 i32) (result i32)
  local.get $0
  local.get $0
  call $~lib/arraybuffer/ArrayBuffer#get:byteLength
  local.get $1
  call $~lib/string/String.UTF8.decodeUnsafe
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/storage/BaseStoredString/BaseStoredString#load (param $0 i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  (local $10 i32)
  (local $11 i32)
  (local $12 i64)
  (local $13 i32)
  (local $14 i32)
  (local $15 i32)
  global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
  local.get $0
  i64.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/storage/BaseStoredString/BaseStoredString#getPointer
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#getStorageAt
  local.set $1
  local.get $1
  i32.const 0
  call $~lib/typedarray/Uint8Array#__get
  local.set $2
  local.get $1
  i32.const 1
  call $~lib/typedarray/Uint8Array#__get
  local.set $3
  local.get $1
  i32.const 2
  call $~lib/typedarray/Uint8Array#__get
  local.set $4
  local.get $1
  i32.const 3
  call $~lib/typedarray/Uint8Array#__get
  local.set $5
  local.get $2
  i32.const 24
  i32.shl
  local.get $3
  i32.const 16
  i32.shl
  i32.or
  local.get $4
  i32.const 8
  i32.shl
  i32.or
  local.get $5
  i32.or
  local.set $6
  local.get $6
  i32.const 0
  i32.eq
  if
   local.get $0
   i32.const 96
   call $~lib/@btc-vision/btc-runtime/runtime/storage/BaseStoredString/BaseStoredString#set:_value
   return
  end
  local.get $6
  local.set $7
  i32.const 0
  local.set $8
  i32.const 0
  local.get $6
  call $~lib/typedarray/Uint8Array#constructor
  local.set $9
  local.get $7
  i32.const 28
  i32.lt_u
  if (result i32)
   local.get $7
  else
   i32.const 28
  end
  local.set $10
  i32.const 0
  local.set $11
  loop $for-loop|0
   local.get $11
   local.get $10
   i32.lt_u
   if
    local.get $9
    local.get $11
    local.get $1
    i32.const 4
    local.get $11
    i32.add
    call $~lib/typedarray/Uint8Array#__get
    call $~lib/typedarray/Uint8Array#__set
    local.get $11
    i32.const 1
    i32.add
    local.set $11
    br $for-loop|0
   end
  end
  local.get $7
  local.get $10
  i32.sub
  local.set $7
  local.get $8
  local.get $10
  i32.add
  local.set $8
  i64.const 1
  local.set $12
  loop $while-continue|1
   local.get $7
   i32.const 0
   i32.gt_u
   if
    global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
    local.get $0
    local.get $12
    call $~lib/@btc-vision/btc-runtime/runtime/storage/BaseStoredString/BaseStoredString#getPointer
    call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#getStorageAt
    local.set $13
    local.get $7
    i32.const 32
    i32.lt_u
    if (result i32)
     local.get $7
    else
     i32.const 32
    end
    local.set $14
    i32.const 0
    local.set $15
    loop $for-loop|2
     local.get $15
     local.get $14
     i32.lt_u
     if
      local.get $9
      local.get $8
      local.get $15
      i32.add
      local.get $13
      local.get $15
      call $~lib/typedarray/Uint8Array#__get
      call $~lib/typedarray/Uint8Array#__set
      local.get $15
      i32.const 1
      i32.add
      local.set $15
      br $for-loop|2
     end
    end
    local.get $7
    local.get $14
    i32.sub
    local.set $7
    local.get $8
    local.get $14
    i32.add
    local.set $8
    local.get $12
    i64.const 1
    i64.add
    local.set $12
    br $while-continue|1
   end
  end
  local.get $0
  local.get $9
  call $~lib/arraybuffer/ArrayBufferView#get:buffer
  i32.const 0
  call $~lib/string/String.UTF8.decode
  call $~lib/@btc-vision/btc-runtime/runtime/storage/BaseStoredString/BaseStoredString#set:_value
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/storage/BaseStoredString/BaseStoredString#get:value (param $0 i32) (result i32)
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/storage/BaseStoredString/BaseStoredString#get:_value
  call $~lib/string/String.__not
  if
   local.get $0
   call $~lib/@btc-vision/btc-runtime/runtime/storage/BaseStoredString/BaseStoredString#load
  end
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/storage/BaseStoredString/BaseStoredString#get:_value
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeU32 (param $0 i32) (param $1 i32) (param $2 i32)
  local.get $0
  global.get $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/U32_BYTE_LENGTH
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#allocSafe
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#get:buffer
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#get:currentOffset
  local.get $1
  local.get $2
  i32.eqz
  call $~lib/dataview/DataView#setUint32
  local.get $0
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#get:currentOffset
  global.get $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/U32_BYTE_LENGTH
  i32.add
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#set:currentOffset
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeStringWithLength (param $0 i32) (param $1 i32)
  (local $2 i32)
  local.get $1
  i32.const 0
  i32.const 1
  global.set $~argumentsLength
  i32.const 0
  call $~lib/string/String.UTF8.encode@varargs
  local.set $2
  local.get $0
  local.get $2
  call $~lib/arraybuffer/ArrayBuffer#get:byteLength
  i32.const 1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeU32
  local.get $0
  local.get $2
  i32.const 0
  i32.const 1
  global.set $~argumentsLength
  i32.const 0
  call $~lib/typedarray/Uint8Array.wrap@varargs
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeBytes
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#name (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  i32.const 0
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#get:_name
  call $~lib/@btc-vision/btc-runtime/runtime/storage/BaseStoredString/BaseStoredString#get:value
  i32.const 0
  call $~lib/string/String.UTF8.byteLength
  i32.const 4
  i32.add
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#constructor
  local.set $2
  local.get $2
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#get:_name
  call $~lib/@btc-vision/btc-runtime/runtime/storage/BaseStoredString/BaseStoredString#get:value
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeStringWithLength
  local.get $2
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#get:_symbol (param $0 i32) (result i32)
  local.get $0
  i32.load offset=44
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#symbol (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  i32.const 0
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#get:_symbol
  call $~lib/@btc-vision/btc-runtime/runtime/storage/BaseStoredString/BaseStoredString#get:value
  i32.const 0
  call $~lib/string/String.UTF8.byteLength
  i32.const 4
  i32.add
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#constructor
  local.set $2
  local.get $2
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#get:_symbol
  call $~lib/@btc-vision/btc-runtime/runtime/storage/BaseStoredString/BaseStoredString#get:value
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeStringWithLength
  local.get $2
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#get:_icon (param $0 i32) (result i32)
  local.get $0
  i32.load offset=40
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#icon (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  i32.const 0
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#get:_icon
  call $~lib/@btc-vision/btc-runtime/runtime/storage/BaseStoredString/BaseStoredString#get:value
  i32.const 0
  call $~lib/string/String.UTF8.byteLength
  i32.const 4
  i32.add
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#constructor
  local.set $2
  local.get $2
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#get:_icon
  call $~lib/@btc-vision/btc-runtime/runtime/storage/BaseStoredString/BaseStoredString#get:value
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeStringWithLength
  local.get $2
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#get:_decimals (param $0 i32) (result i32)
  local.get $0
  i32.load offset=32
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#decimals (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  i32.const 0
  i32.const 1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#constructor
  local.set $2
  local.get $2
  block $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#toU32|inlined.0 (result i32)
   local.get $0
   call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#get:_decimals
   call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredU256/StoredU256#get:value
   local.set $3
   local.get $3
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo1
   i32.wrap_i64
   br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#toU32|inlined.0
  end
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeU8
  local.get $2
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#totalSupply (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  i32.const 0
  global.get $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/U256_BYTE_LENGTH
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#constructor
  local.set $2
  local.get $2
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#get:_totalSupply
  call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredU256/StoredU256#get:value
  i32.const 1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeU256
  local.get $2
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#maximumSupply (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  i32.const 0
  global.get $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/U256_BYTE_LENGTH
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#constructor
  local.set $2
  local.get $2
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#get:_maxSupply
  call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredU256/StoredU256#get:value
  i32.const 1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeU256
  local.get $2
  return
 )
 (func $~lib/array/Array<u8>#__get (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  local.get $1
  local.get $0
  call $~lib/array/Array<u8>#get:length_
  i32.ge_u
  if
   i32.const 3056
   i32.const 4336
   i32.const 114
   i32.const 42
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  call $~lib/array/Array<u8>#get:dataStart
  local.get $1
  i32.const 0
  i32.shl
  i32.add
  i32.load8_u
  local.set $2
  i32.const 0
  drop
  local.get $2
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeBytesU8Array (param $0 i32) (param $1 i32)
  (local $2 i32)
  local.get $0
  local.get $1
  call $~lib/array/Array<u8>#get:length
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#allocSafe
  i32.const 0
  local.set $2
  loop $for-loop|0
   local.get $2
   local.get $1
   call $~lib/array/Array<u8>#get:length
   i32.lt_s
   if
    local.get $0
    local.get $1
    local.get $2
    call $~lib/array/Array<u8>#__get
    call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeU8
    local.get $2
    i32.const 1
    i32.add
    local.set $2
    br $for-loop|0
   end
  end
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/global/stringToBytes (param $0 i32) (result i32)
  (local $1 i32)
  local.get $0
  i32.const 0
  i32.const 1
  global.set $~argumentsLength
  i32.const 0
  call $~lib/string/String.UTF8.encode@varargs
  local.set $1
  local.get $1
  i32.const 0
  i32.const 1
  global.set $~argumentsLength
  i32.const 0
  call $~lib/typedarray/Uint8Array.wrap@varargs
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/global/sha256String (param $0 i32) (result i32)
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/env/global/stringToBytes
  call $~lib/@btc-vision/btc-runtime/runtime/env/global/sha256
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:_protocolId (param $0 i32) (result i32)
  local.get $0
  i32.load offset=48
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:protocolId (param $0 i32) (result i32)
  (local $1 i32)
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:_protocolId
  i32.eqz
  if
   i32.const 13728
   i32.const 5536
   i32.const 264
   i32.const 13
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:_protocolId
  local.tee $1
  if (result i32)
   local.get $1
  else
   i32.const 9408
   i32.const 5536
   i32.const 266
   i32.const 16
   call $~lib/builtins/abort
   unreachable
  end
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:_contractAddress (param $0 i32) (result i32)
  local.get $0
  i32.load offset=40
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:contractAddress (param $0 i32) (result i32)
  (local $1 i32)
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:_contractAddress
  i32.eqz
  if
   i32.const 13808
   i32.const 5536
   i32.const 231
   i32.const 13
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:_contractAddress
  local.tee $1
  if (result i32)
   local.get $1
  else
   i32.const 9408
   i32.const 5536
   i32.const 233
   i32.const 16
   call $~lib/builtins/abort
   unreachable
  end
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP_NET/OP_NET#get:address (param $0 i32) (result i32)
  global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:contractAddress
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#_buildDomainSeparator (param $0 i32) (result i32)
  (local $1 i32)
  i32.const 0
  i32.const 32
  i32.const 5
  i32.mul
  global.get $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/ADDRESS_BYTE_LENGTH
  i32.add
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#constructor
  local.set $1
  local.get $1
  global.get $~lib/@btc-vision/btc-runtime/runtime/constants/Exports/OP712_DOMAIN_TYPE_HASH
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeBytesU8Array
  local.get $1
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#get:_name
  call $~lib/@btc-vision/btc-runtime/runtime/storage/BaseStoredString/BaseStoredString#get:value
  call $~lib/@btc-vision/btc-runtime/runtime/env/global/sha256String
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeBytes
  local.get $1
  global.get $~lib/@btc-vision/btc-runtime/runtime/constants/Exports/OP712_VERSION_HASH
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeBytesU8Array
  local.get $1
  global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:chainId
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeBytes
  local.get $1
  global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:protocolId
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeBytes
  local.get $1
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP_NET/OP_NET#get:address
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeAddress
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#getBuffer
  call $~lib/@btc-vision/btc-runtime/runtime/env/global/sha256
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#domainSeparator (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  i32.const 0
  i32.const 32
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#constructor
  local.set $2
  local.get $2
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#_buildDomainSeparator
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeBytes
  local.get $2
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#balanceOf (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  local.get $0
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readAddress
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#_balanceOf
  local.set $2
  i32.const 0
  global.get $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/U256_BYTE_LENGTH
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#constructor
  local.set $3
  local.get $3
  local.get $2
  i32.const 1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeU256
  local.get $3
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#get:_nonceMap (param $0 i32) (result i32)
  local.get $0
  i32.load offset=48
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#nonceOf (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#get:_nonceMap
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readAddress
  call $~lib/@btc-vision/btc-runtime/runtime/memory/AddressMemoryMap/AddressMemoryMap#get
  local.set $2
  i32.const 0
  global.get $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/U256_BYTE_LENGTH
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#constructor
  local.set $3
  local.get $3
  local.get $2
  i32.const 1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeU256
  local.get $3
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#get:allowanceMap (param $0 i32) (result i32)
  local.get $0
  i32.load offset=20
 )
 (func $"~lib/@btc-vision/btc-runtime/runtime/generic/Map/Map<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address,~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#get:_keys" (param $0 i32) (result i32)
  local.get $0
  i32.load
 )
 (func $~lib/array/Array<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address>#get:length_ (param $0 i32) (result i32)
  local.get $0
  i32.load offset=12
 )
 (func $~lib/array/Array<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address>#get:length (param $0 i32) (result i32)
  local.get $0
  call $~lib/array/Array<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address>#get:length_
  return
 )
 (func $"~lib/@btc-vision/btc-runtime/runtime/generic/Map/Map<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address,~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#get:_lastIndex" (param $0 i32) (result i32)
  local.get $0
  i32.load offset=8
 )
 (func $~lib/array/Array<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address>#get:dataStart (param $0 i32) (result i32)
  local.get $0
  i32.load offset=4
 )
 (func $~lib/array/Array<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address>#__get (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  local.get $1
  local.get $0
  call $~lib/array/Array<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address>#get:length_
  i32.ge_u
  if
   i32.const 3056
   i32.const 4336
   i32.const 114
   i32.const 42
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  call $~lib/array/Array<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address>#get:dataStart
  local.get $1
  i32.const 2
  i32.shl
  i32.add
  i32.load
  local.set $2
  i32.const 1
  drop
  i32.const 0
  i32.eqz
  drop
  local.get $2
  i32.eqz
  if
   i32.const 9824
   i32.const 4336
   i32.const 118
   i32.const 40
   call $~lib/builtins/abort
   unreachable
  end
  local.get $2
  return
 )
 (func $"~lib/@btc-vision/btc-runtime/runtime/generic/Map/Map<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address,~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#indexOf" (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  local.get $0
  call $"~lib/@btc-vision/btc-runtime/runtime/generic/Map/Map<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address,~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#get:_keys"
  call $~lib/array/Array<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address>#get:length
  local.set $2
  local.get $0
  call $"~lib/@btc-vision/btc-runtime/runtime/generic/Map/Map<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address,~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#get:_lastIndex"
  i32.const -1
  i32.ne
  if (result i32)
   local.get $0
   call $"~lib/@btc-vision/btc-runtime/runtime/generic/Map/Map<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address,~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#get:_lastIndex"
   local.get $2
   i32.lt_s
  else
   i32.const 0
  end
  if
   local.get $0
   call $"~lib/@btc-vision/btc-runtime/runtime/generic/Map/Map<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address,~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#get:_keys"
   local.get $0
   call $"~lib/@btc-vision/btc-runtime/runtime/generic/Map/Map<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address,~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#get:_lastIndex"
   call $~lib/array/Array<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address>#__get
   local.get $1
   call $~lib/@btc-vision/btc-runtime/runtime/types/Address/Address#equals
   if
    local.get $0
    call $"~lib/@btc-vision/btc-runtime/runtime/generic/Map/Map<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address,~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#get:_lastIndex"
    return
   end
  end
  local.get $2
  i32.const 1
  i32.sub
  local.set $3
  loop $for-loop|0
   local.get $3
   i32.const 0
   i32.ge_s
   if
    local.get $0
    call $"~lib/@btc-vision/btc-runtime/runtime/generic/Map/Map<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address,~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#get:_keys"
    local.get $3
    call $~lib/array/Array<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address>#__get
    local.get $1
    call $~lib/@btc-vision/btc-runtime/runtime/types/Address/Address#equals
    if
     local.get $0
     local.get $3
     call $"~lib/@btc-vision/btc-runtime/runtime/generic/Map/Map<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address,~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#set:_lastIndex"
     local.get $3
     return
    end
    local.get $3
    i32.const 1
    i32.sub
    local.set $3
    br $for-loop|0
   end
  end
  i32.const -1
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>#set:pointer (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store16 offset=4
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>#set:parentKey (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store
  local.get $0
  local.get $1
  i32.const 0
  call $~lib/rt/stub/__link
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>#constructor (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  local.get $0
  i32.eqz
  if
   i32.const 6
   i32.const 41
   call $~lib/rt/stub/__new
   local.set $0
  end
  local.get $0
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>#set:parentKey
  local.get $0
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>#set:pointer
  local.get $0
  local.get $2
  call $~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>#set:pointer
  local.get $0
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>#set:parentKey
  local.get $0
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/memory/MapOfMap/MapOfMap<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>#get:pointer (param $0 i32) (result i32)
  local.get $0
  i32.load16_u offset=12
 )
 (func $"~lib/@btc-vision/btc-runtime/runtime/generic/Map/Map<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address,~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#get:_values" (param $0 i32) (result i32)
  local.get $0
  i32.load offset=4
 )
 (func $~lib/array/Array<~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#get:length_ (param $0 i32) (result i32)
  local.get $0
  i32.load offset=12
 )
 (func $~lib/array/Array<~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#set:length_ (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=12
 )
 (func $~lib/array/Array<~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#get:dataStart (param $0 i32) (result i32)
  local.get $0
  i32.load offset=4
 )
 (func $~lib/array/Array<~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#__set (param $0 i32) (param $1 i32) (param $2 i32)
  local.get $1
  local.get $0
  call $~lib/array/Array<~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#get:length_
  i32.ge_u
  if
   local.get $1
   i32.const 0
   i32.lt_s
   if
    i32.const 3056
    i32.const 4336
    i32.const 130
    i32.const 22
    call $~lib/builtins/abort
    unreachable
   end
   local.get $0
   local.get $1
   i32.const 1
   i32.add
   i32.const 2
   i32.const 1
   call $~lib/array/ensureCapacity
   local.get $0
   local.get $1
   i32.const 1
   i32.add
   call $~lib/array/Array<~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#set:length_
  end
  local.get $0
  call $~lib/array/Array<~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#get:dataStart
  local.get $1
  i32.const 2
  i32.shl
  i32.add
  local.get $2
  i32.store
  i32.const 1
  drop
  local.get $0
  local.get $2
  i32.const 1
  call $~lib/rt/stub/__link
 )
 (func $~lib/array/Array<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address>#set:length_ (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=12
 )
 (func $~lib/array/Array<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address>#push (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  local.get $0
  call $~lib/array/Array<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address>#get:length_
  local.set $2
  local.get $2
  i32.const 1
  i32.add
  local.set $3
  local.get $0
  local.get $3
  i32.const 2
  i32.const 1
  call $~lib/array/ensureCapacity
  i32.const 1
  drop
  local.get $0
  call $~lib/array/Array<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address>#get:dataStart
  local.get $2
  i32.const 2
  i32.shl
  i32.add
  local.get $1
  i32.store
  local.get $0
  local.get $1
  i32.const 1
  call $~lib/rt/stub/__link
  local.get $0
  local.get $3
  call $~lib/array/Array<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address>#set:length_
  local.get $3
  return
 )
 (func $~lib/array/Array<~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#push (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  local.get $0
  call $~lib/array/Array<~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#get:length_
  local.set $2
  local.get $2
  i32.const 1
  i32.add
  local.set $3
  local.get $0
  local.get $3
  i32.const 2
  i32.const 1
  call $~lib/array/ensureCapacity
  i32.const 1
  drop
  local.get $0
  call $~lib/array/Array<~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#get:dataStart
  local.get $2
  i32.const 2
  i32.shl
  i32.add
  local.get $1
  i32.store
  local.get $0
  local.get $1
  i32.const 1
  call $~lib/rt/stub/__link
  local.get $0
  local.get $3
  call $~lib/array/Array<~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#set:length_
  local.get $3
  return
 )
 (func $"~lib/@btc-vision/btc-runtime/runtime/generic/Map/Map<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address,~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#set" (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  (local $3 i32)
  local.get $0
  call $"~lib/@btc-vision/btc-runtime/runtime/generic/Map/Map<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address,~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#get:_lastIndex"
  i32.const -1
  i32.ne
  if
   local.get $0
   call $"~lib/@btc-vision/btc-runtime/runtime/generic/Map/Map<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address,~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#get:_keys"
   local.get $0
   call $"~lib/@btc-vision/btc-runtime/runtime/generic/Map/Map<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address,~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#get:_lastIndex"
   call $~lib/array/Array<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address>#__get
   local.get $1
   call $~lib/@btc-vision/btc-runtime/runtime/types/Address/Address#equals
   if
    local.get $0
    call $"~lib/@btc-vision/btc-runtime/runtime/generic/Map/Map<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address,~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#get:_values"
    local.get $0
    call $"~lib/@btc-vision/btc-runtime/runtime/generic/Map/Map<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address,~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#get:_lastIndex"
    local.get $2
    call $~lib/array/Array<~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#__set
    local.get $0
    return
   end
  end
  local.get $0
  local.get $1
  call $"~lib/@btc-vision/btc-runtime/runtime/generic/Map/Map<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address,~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#indexOf@override"
  local.set $3
  local.get $3
  i32.const -1
  i32.eq
  if
   local.get $0
   call $"~lib/@btc-vision/btc-runtime/runtime/generic/Map/Map<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address,~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#get:_keys"
   local.get $1
   call $~lib/array/Array<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address>#push
   drop
   local.get $0
   call $"~lib/@btc-vision/btc-runtime/runtime/generic/Map/Map<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address,~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#get:_values"
   local.get $2
   call $~lib/array/Array<~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#push
   drop
   local.get $0
   local.get $0
   call $"~lib/@btc-vision/btc-runtime/runtime/generic/Map/Map<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address,~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#get:_keys"
   call $~lib/array/Array<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address>#get:length
   i32.const 1
   i32.sub
   call $"~lib/@btc-vision/btc-runtime/runtime/generic/Map/Map<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address,~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#set:_lastIndex"
  else
   local.get $0
   call $"~lib/@btc-vision/btc-runtime/runtime/generic/Map/Map<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address,~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#get:_values"
   local.get $3
   local.get $2
   call $~lib/array/Array<~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#__set
   local.get $0
   local.get $3
   call $"~lib/@btc-vision/btc-runtime/runtime/generic/Map/Map<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address,~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#set:_lastIndex"
  end
  local.get $0
  return
 )
 (func $~lib/array/Array<~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#__get (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  local.get $1
  local.get $0
  call $~lib/array/Array<~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#get:length_
  i32.ge_u
  if
   i32.const 3056
   i32.const 4336
   i32.const 114
   i32.const 42
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  call $~lib/array/Array<~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#get:dataStart
  local.get $1
  i32.const 2
  i32.shl
  i32.add
  i32.load
  local.set $2
  i32.const 1
  drop
  i32.const 0
  i32.eqz
  drop
  local.get $2
  i32.eqz
  if
   i32.const 9824
   i32.const 4336
   i32.const 118
   i32.const 40
   call $~lib/builtins/abort
   unreachable
  end
  local.get $2
  return
 )
 (func $"~lib/@btc-vision/btc-runtime/runtime/generic/Map/Map<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address,~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#get" (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  local.get $0
  local.get $1
  call $"~lib/@btc-vision/btc-runtime/runtime/generic/Map/Map<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address,~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#indexOf@override"
  local.set $2
  local.get $2
  i32.const -1
  i32.eq
  if
   i32.const 13888
   i32.const 13968
   i32.const 92
   i32.const 13
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  call $"~lib/@btc-vision/btc-runtime/runtime/generic/Map/Map<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address,~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#get:_values"
  local.get $2
  call $~lib/array/Array<~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#__get
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>#get:parentKey (param $0 i32) (result i32)
  local.get $0
  i32.load
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>#get:pointer (param $0 i32) (result i32)
  local.get $0
  i32.load16_u offset=4
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/math/abi/encodePointerUnknownLength (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/env/global/sha256
  local.set $2
  local.get $0
  local.get $2
  i32.const 0
  i32.const 96
  call $~lib/@btc-vision/btc-runtime/runtime/math/abi/encodePointer
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>#encodePointer (param $0 i32) (param $1 i32) (result i32)
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>#get:pointer
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#getBuffer
  call $~lib/@btc-vision/btc-runtime/runtime/math/abi/encodePointerUnknownLength
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>#getKeyHash (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  i32.const 0
  local.get $1
  call $~lib/arraybuffer/ArrayBufferView#get:byteLength
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>#get:parentKey
  call $~lib/arraybuffer/ArrayBufferView#get:byteLength
  i32.add
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#constructor
  local.set $2
  local.get $2
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>#get:parentKey
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeBytes
  local.get $2
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeBytes
  local.get $0
  local.get $2
  call $~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>#encodePointer
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>#toValue (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  i32.const 24
  i32.const 24
  i32.eq
  drop
  block $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.fromUint8ArrayBE|inlined.2 (result i32)
   local.get $1
   local.set $2
   local.get $2
   call $~lib/typedarray/Uint8Array#get:length
   i32.const 32
   i32.ne
   if
    i32.const 2672
    i32.const 6032
    i32.const 220
    i32.const 30
    call $~lib/builtins/abort
    unreachable
   end
   local.get $2
   call $~lib/arraybuffer/ArrayBufferView#get:dataStart
   local.set $3
   i32.const 0
   local.get $3
   i64.load offset=24
   call $~lib/polyfills/bswap<u64>
   local.get $3
   i64.load offset=16
   call $~lib/polyfills/bswap<u64>
   local.get $3
   i64.load offset=8
   call $~lib/polyfills/bswap<u64>
   local.get $3
   i64.load
   call $~lib/polyfills/bswap<u64>
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#constructor
   br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.fromUint8ArrayBE|inlined.2
  end
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>#get (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  local.get $0
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>#getKeyHash
  local.set $2
  local.get $0
  global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
  local.get $2
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#getStorageAt
  call $~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>#toValue
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#_allowance (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  block $~lib/@btc-vision/btc-runtime/runtime/memory/MapOfMap/MapOfMap<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>#get|inlined.0 (result i32)
   local.get $0
   call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#get:allowanceMap
   local.set $3
   local.get $1
   local.set $4
   local.get $3
   local.set $5
   local.get $4
   local.set $6
   block $"~lib/@btc-vision/btc-runtime/runtime/generic/Map/Map<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address,~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#has|inlined.0" (result i32)
    local.get $5
    local.set $7
    local.get $6
    local.set $8
    local.get $7
    local.get $8
    call $"~lib/@btc-vision/btc-runtime/runtime/generic/Map/Map<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address,~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#indexOf@override"
    i32.const -1
    i32.ne
    br $"~lib/@btc-vision/btc-runtime/runtime/generic/Map/Map<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address,~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#has|inlined.0"
   end
   i32.eqz
   if
    local.get $5
    local.get $6
    i32.const 0
    local.get $6
    local.get $5
    call $~lib/@btc-vision/btc-runtime/runtime/memory/MapOfMap/MapOfMap<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>#get:pointer
    call $~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>#constructor
    call $"~lib/@btc-vision/btc-runtime/runtime/generic/Map/Map<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address,~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#set"
    drop
   end
   local.get $3
   local.get $4
   call $"~lib/@btc-vision/btc-runtime/runtime/generic/Map/Map<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address,~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#get"
   br $~lib/@btc-vision/btc-runtime/runtime/memory/MapOfMap/MapOfMap<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>#get|inlined.0
  end
  local.set $9
  local.get $9
  local.get $2
  call $~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>#get
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#allowance (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  i32.const 0
  global.get $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/U256_BYTE_LENGTH
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#constructor
  local.set $2
  local.get $0
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readAddress
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readAddress
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#_allowance
  local.set $3
  local.get $2
  local.get $3
  i32.const 1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeU256
  local.get $2
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/events/predefined/TransferredEvent/TransferredEvent#constructor (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32) (param $4 i32) (result i32)
  (local $5 i32)
  local.get $0
  i32.eqz
  if
   i32.const 12
   i32.const 61
   call $~lib/rt/stub/__new
   local.set $0
  end
  i32.const 0
  global.get $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/ADDRESS_BYTE_LENGTH
  i32.const 3
  i32.mul
  global.get $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/U256_BYTE_LENGTH
  i32.add
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#constructor
  local.set $5
  local.get $5
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeAddress
  local.get $5
  local.get $2
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeAddress
  local.get $5
  local.get $3
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeAddress
  local.get $5
  local.get $4
  i32.const 1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeU256
  local.get $0
  i32.const 14096
  local.get $5
  call $~lib/@btc-vision/btc-runtime/runtime/events/NetEvent/NetEvent#constructor
  local.set $0
  local.get $0
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#createTransferredEvent (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32) (param $4 i32)
  local.get $0
  i32.const 0
  local.get $1
  local.get $2
  local.get $3
  local.get $4
  call $~lib/@btc-vision/btc-runtime/runtime/events/predefined/TransferredEvent/TransferredEvent#constructor
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP_NET/OP_NET#emitEvent
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#_transfer (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/types/Address/Address.zero
  call $~lib/@btc-vision/btc-runtime/runtime/types/Address/Address#equals
  if
   i32.const 13152
   i32.const 12368
   i32.const 636
   i32.const 13
   call $~lib/builtins/abort
   unreachable
  end
  local.get $2
  call $~lib/@btc-vision/btc-runtime/runtime/types/Address/Address.zero
  call $~lib/@btc-vision/btc-runtime/runtime/types/Address/Address#equals
  if
   i32.const 12304
   i32.const 12368
   i32.const 640
   i32.const 13
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#get:balanceOfMap
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/memory/AddressMemoryMap/AddressMemoryMap#get
  local.set $4
  local.get $4
  local.get $3
  call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.lt
  if
   i32.const 13088
   i32.const 12368
   i32.const 645
   i32.const 13
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#get:balanceOfMap
  local.get $1
  local.get $4
  local.get $3
  call $~lib/@btc-vision/btc-runtime/runtime/types/SafeMath/SafeMath.sub
  call $~lib/@btc-vision/btc-runtime/runtime/memory/AddressMemoryMap/AddressMemoryMap#set
  drop
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#get:balanceOfMap
  local.get $2
  call $~lib/@btc-vision/btc-runtime/runtime/memory/AddressMemoryMap/AddressMemoryMap#get
  local.set $5
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#get:balanceOfMap
  local.get $2
  local.get $5
  local.get $3
  call $~lib/@btc-vision/btc-runtime/runtime/types/SafeMath/SafeMath.add
  call $~lib/@btc-vision/btc-runtime/runtime/memory/AddressMemoryMap/AddressMemoryMap#set
  drop
  local.get $0
  block $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:tx|inlined.4 (result i32)
   global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
   local.set $6
   local.get $6
   call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:_tx
   i32.eqz
   if
    i32.const 11968
    i32.const 5536
    i32.const 145
    i32.const 13
    call $~lib/builtins/abort
    unreachable
   end
   local.get $6
   call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:_tx
   local.tee $7
   if (result i32)
    local.get $7
   else
    i32.const 9408
    i32.const 5536
    i32.const 147
    i32.const 16
    call $~lib/builtins/abort
    unreachable
   end
   br $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:tx|inlined.4
  end
  call $~lib/@btc-vision/btc-runtime/runtime/env/classes/Transaction/Transaction#get:sender
  local.get $1
  local.get $2
  local.get $3
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#createTransferredEvent
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#transfer (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  local.get $0
  block $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:tx|inlined.3 (result i32)
   global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
   local.set $2
   local.get $2
   call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:_tx
   i32.eqz
   if
    i32.const 11968
    i32.const 5536
    i32.const 145
    i32.const 13
    call $~lib/builtins/abort
    unreachable
   end
   local.get $2
   call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:_tx
   local.tee $3
   if (result i32)
    local.get $3
   else
    i32.const 9408
    i32.const 5536
    i32.const 147
    i32.const 16
    call $~lib/builtins/abort
    unreachable
   end
   br $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:tx|inlined.3
  end
  call $~lib/@btc-vision/btc-runtime/runtime/env/classes/Transaction/Transaction#get:sender
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readAddress
  local.get $1
  i32.const 1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readU256
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#_transfer
  i32.const 0
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#constructor
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>#from (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  (local $10 i32)
  (local $11 i32)
  i32.const 24
  i32.const 24
  i32.eq
  drop
  block $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#toUint8Array|inlined.4 (result i32)
   local.get $1
   local.set $2
   i32.const 1
   local.set $3
   i32.const 0
   i32.const 32
   call $~lib/typedarray/Uint8Array#constructor
   local.set $4
   local.get $2
   local.set $5
   local.get $4
   call $~lib/arraybuffer/ArrayBufferView#get:dataStart
   local.set $6
   local.get $3
   local.set $7
   local.get $7
   if
    local.get $5
    local.set $8
    local.get $6
    local.set $9
    local.get $9
    local.get $8
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi2
    call $~lib/polyfills/bswap<u64>
    i64.store
    local.get $9
    local.get $8
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi1
    call $~lib/polyfills/bswap<u64>
    i64.store offset=8
    local.get $9
    local.get $8
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo2
    call $~lib/polyfills/bswap<u64>
    i64.store offset=16
    local.get $9
    local.get $8
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo1
    call $~lib/polyfills/bswap<u64>
    i64.store offset=24
   else
    local.get $5
    local.set $10
    local.get $6
    local.set $11
    local.get $11
    local.get $10
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo1
    i64.store
    local.get $11
    local.get $10
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo2
    i64.store offset=8
    local.get $11
    local.get $10
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi1
    i64.store offset=16
    local.get $11
    local.get $10
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi2
    i64.store offset=24
   end
   local.get $4
   br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#toUint8Array|inlined.4
  end
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>#set (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  local.get $0
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>#getKeyHash
  local.set $3
  global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
  local.set $4
  local.get $3
  local.set $5
  local.get $0
  local.get $2
  call $~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>#from
  local.set $6
  local.get $4
  local.get $5
  local.get $6
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#_internalSetStorageAt
  local.get $0
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#_spendAllowance (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  (local $10 i32)
  (local $11 i32)
  (local $12 i32)
  (local $13 i32)
  (local $14 i32)
  (local $15 i32)
  (local $16 i32)
  (local $17 i32)
  (local $18 i32)
  (local $19 i32)
  (local $20 i32)
  (local $21 i32)
  local.get $1
  local.get $2
  call $~lib/@btc-vision/btc-runtime/runtime/types/Address/Address#equals
  if
   return
  end
  block $~lib/@btc-vision/btc-runtime/runtime/memory/MapOfMap/MapOfMap<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>#get|inlined.1 (result i32)
   local.get $0
   call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#get:allowanceMap
   local.set $4
   local.get $1
   local.set $5
   local.get $4
   local.set $6
   local.get $5
   local.set $7
   block $"~lib/@btc-vision/btc-runtime/runtime/generic/Map/Map<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address,~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#has|inlined.1" (result i32)
    local.get $6
    local.set $8
    local.get $7
    local.set $9
    local.get $8
    local.get $9
    call $"~lib/@btc-vision/btc-runtime/runtime/generic/Map/Map<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address,~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#indexOf@override"
    i32.const -1
    i32.ne
    br $"~lib/@btc-vision/btc-runtime/runtime/generic/Map/Map<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address,~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#has|inlined.1"
   end
   i32.eqz
   if
    local.get $6
    local.get $7
    i32.const 0
    local.get $7
    local.get $6
    call $~lib/@btc-vision/btc-runtime/runtime/memory/MapOfMap/MapOfMap<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>#get:pointer
    call $~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>#constructor
    call $"~lib/@btc-vision/btc-runtime/runtime/generic/Map/Map<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address,~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#set"
    drop
   end
   local.get $4
   local.get $5
   call $"~lib/@btc-vision/btc-runtime/runtime/generic/Map/Map<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address,~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#get"
   br $~lib/@btc-vision/btc-runtime/runtime/memory/MapOfMap/MapOfMap<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>#get|inlined.1
  end
  local.set $10
  local.get $10
  local.get $2
  call $~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>#get
  local.set $11
  block $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.eq|inlined.2 (result i32)
   local.get $11
   local.set $12
   block $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.get:Max|inlined.0 (result i32)
    i32.const 0
    i64.const -1
    i64.const -1
    i64.const -1
    i64.const -1
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#constructor
    br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.get:Max|inlined.0
   end
   local.set $13
   local.get $12
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo1
   local.get $13
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo1
   i64.eq
   if (result i32)
    local.get $12
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo2
    local.get $13
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo2
    i64.eq
   else
    i32.const 0
   end
   if (result i32)
    local.get $12
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi1
    local.get $13
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi1
    i64.eq
   else
    i32.const 0
   end
   if (result i32)
    local.get $12
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi2
    local.get $13
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi2
    i64.eq
   else
    i32.const 0
   end
   br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.eq|inlined.2
  end
  if
   return
  end
  local.get $11
  local.get $3
  call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.lt
  if
   i32.const 14144
   i32.const 12368
   i32.const 683
   i32.const 13
   call $~lib/builtins/abort
   unreachable
  end
  local.get $10
  local.get $2
  local.get $11
  local.get $3
  call $~lib/@btc-vision/btc-runtime/runtime/types/SafeMath/SafeMath.sub
  call $~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>#set
  drop
  block $~lib/@btc-vision/btc-runtime/runtime/memory/MapOfMap/MapOfMap<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>#set|inlined.0 (result i32)
   local.get $0
   call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#get:allowanceMap
   local.set $14
   local.get $1
   local.set $15
   local.get $10
   local.set $16
   local.get $14
   local.set $17
   local.get $15
   local.set $18
   block $"~lib/@btc-vision/btc-runtime/runtime/generic/Map/Map<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address,~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#has|inlined.2" (result i32)
    local.get $17
    local.set $19
    local.get $18
    local.set $20
    local.get $19
    local.get $20
    call $"~lib/@btc-vision/btc-runtime/runtime/generic/Map/Map<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address,~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#indexOf@override"
    i32.const -1
    i32.ne
    br $"~lib/@btc-vision/btc-runtime/runtime/generic/Map/Map<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address,~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#has|inlined.2"
   end
   i32.eqz
   if
    local.get $17
    local.get $18
    i32.const 0
    local.get $18
    local.get $17
    call $~lib/@btc-vision/btc-runtime/runtime/memory/MapOfMap/MapOfMap<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>#get:pointer
    call $~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>#constructor
    call $"~lib/@btc-vision/btc-runtime/runtime/generic/Map/Map<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address,~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#set"
    drop
   end
   local.get $14
   local.get $15
   local.get $16
   call $"~lib/@btc-vision/btc-runtime/runtime/generic/Map/Map<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address,~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#set"
   local.tee $21
   call $~instanceof|~lib/@btc-vision/btc-runtime/runtime/memory/MapOfMap/MapOfMap<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>
   if (result i32)
    local.get $21
   else
    i32.const 14208
    i32.const 14272
    i32.const 26
    i32.const 22
    call $~lib/builtins/abort
    unreachable
   end
   br $~lib/@btc-vision/btc-runtime/runtime/memory/MapOfMap/MapOfMap<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>#set|inlined.0
  end
  drop
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#transferFrom (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readAddress
  local.set $2
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readAddress
  local.set $3
  local.get $1
  i32.const 1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readU256
  local.set $4
  local.get $0
  local.get $2
  block $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:tx|inlined.5 (result i32)
   global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
   local.set $5
   local.get $5
   call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:_tx
   i32.eqz
   if
    i32.const 11968
    i32.const 5536
    i32.const 145
    i32.const 13
    call $~lib/builtins/abort
    unreachable
   end
   local.get $5
   call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:_tx
   local.tee $6
   if (result i32)
    local.get $6
   else
    i32.const 9408
    i32.const 5536
    i32.const 147
    i32.const 16
    call $~lib/builtins/abort
    unreachable
   end
   br $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:tx|inlined.5
  end
  call $~lib/@btc-vision/btc-runtime/runtime/env/classes/Transaction/Transaction#get:sender
  local.get $4
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#_spendAllowance
  local.get $0
  local.get $2
  local.get $3
  local.get $4
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#_transfer
  i32.const 0
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#constructor
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readBytesWithLength (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  local.get $0
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readU32
  local.set $2
  local.get $0
  local.get $2
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readBytes
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeSelector (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.const 1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeU32
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeBytesWithLength (param $0 i32) (param $1 i32)
  (local $2 i32)
  (local $3 i32)
  local.get $1
  call $~lib/typedarray/Uint8Array#get:length
  local.set $2
  local.get $0
  local.get $2
  global.get $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/U32_BYTE_LENGTH
  i32.add
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#allocSafe
  local.get $0
  local.get $2
  i32.const 1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeU32
  i32.const 0
  local.set $3
  loop $for-loop|0
   local.get $3
   local.get $2
   i32.lt_u
   if
    local.get $0
    local.get $1
    local.get $3
    call $~lib/typedarray/Uint8Array#__get
    call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeU8
    local.get $3
    i32.const 1
    i32.add
    local.set $3
    br $for-loop|0
   end
  end
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/CallResult#set:success (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store8
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/CallResult#set:data (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=4
  local.get $0
  local.get $1
  i32.const 0
  call $~lib/rt/stub/__link
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/CallResult#constructor (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  local.get $0
  i32.eqz
  if
   i32.const 8
   i32.const 62
   call $~lib/rt/stub/__new
   local.set $0
  end
  local.get $0
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/CallResult#set:success
  local.get $0
  local.get $2
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/CallResult#set:data
  local.get $0
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#call (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32) (result i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  local.get $1
  i32.eqz
  if
   i32.const 14416
   i32.const 5536
   i32.const 400
   i32.const 13
   call $~lib/builtins/abort
   unreachable
  end
  local.get $1
  call $~lib/arraybuffer/ArrayBufferView#get:buffer
  local.get $2
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#getBuffer
  call $~lib/arraybuffer/ArrayBufferView#get:buffer
  local.get $2
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#bufferLength
  global.get $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/FOUR_BYTES_UINT8ARRAY_MEMORY_CACHE
  call $~lib/arraybuffer/ArrayBufferView#get:buffer
  call $~lib/@btc-vision/btc-runtime/runtime/env/global/callContract
  local.set $4
  global.get $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/FOUR_BYTES_UINT8ARRAY_MEMORY_CACHE
  call $~lib/arraybuffer/ArrayBufferView#get:dataStart
  i32.load
  call $~lib/polyfills/bswap<u32>
  local.set $5
  i32.const 0
  local.get $5
  call $~lib/arraybuffer/ArrayBuffer#constructor
  local.set $6
  i32.const 0
  local.get $5
  local.get $6
  call $~lib/@btc-vision/btc-runtime/runtime/env/global/getCallResult
  local.get $4
  i32.const 0
  i32.ne
  if (result i32)
   local.get $3
  else
   i32.const 0
  end
  if
   local.get $4
   local.get $6
   local.get $5
   call $~lib/@btc-vision/btc-runtime/runtime/env/global/env_exit
  end
  i32.const 0
  local.get $4
  i32.const 0
  i32.eq
  i32.const 0
  local.get $6
  i32.const 0
  i32.const 1
  global.set $~argumentsLength
  i32.const 0
  call $~lib/typedarray/Uint8Array.wrap@varargs
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#constructor
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/CallResult#constructor
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/CallResult#get:data (param $0 i32) (result i32)
  local.get $0
  i32.load offset=4
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#get:byteLength (param $0 i32) (result i32)
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#get:buffer
  call $~lib/dataview/DataView#get:byteLength
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#_callOnOP20Received (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32) (param $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  (local $10 i32)
  block $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:tx|inlined.7 (result i32)
   global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
   local.set $5
   local.get $5
   call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:_tx
   i32.eqz
   if
    i32.const 11968
    i32.const 5536
    i32.const 145
    i32.const 13
    call $~lib/builtins/abort
    unreachable
   end
   local.get $5
   call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:_tx
   local.tee $6
   if (result i32)
    local.get $6
   else
    i32.const 9408
    i32.const 5536
    i32.const 147
    i32.const 16
    call $~lib/builtins/abort
    unreachable
   end
   br $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:tx|inlined.7
  end
  call $~lib/@btc-vision/btc-runtime/runtime/env/classes/Transaction/Transaction#get:sender
  local.set $7
  i32.const 0
  global.get $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/SELECTOR_BYTE_LENGTH
  global.get $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/ADDRESS_BYTE_LENGTH
  i32.const 2
  i32.mul
  i32.add
  global.get $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/U256_BYTE_LENGTH
  i32.add
  global.get $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/U32_BYTE_LENGTH
  i32.add
  local.get $4
  call $~lib/typedarray/Uint8Array#get:length
  i32.add
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#constructor
  local.set $8
  local.get $8
  global.get $~lib/@btc-vision/btc-runtime/runtime/constants/Exports/ON_OP20_RECEIVED_SELECTOR
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeSelector
  local.get $8
  local.get $7
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeAddress
  local.get $8
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeAddress
  local.get $8
  local.get $3
  i32.const 1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeU256
  local.get $8
  local.get $4
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeBytesWithLength
  global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
  local.get $2
  local.get $8
  i32.const 1
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#call
  local.set $9
  local.get $9
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/CallResult#get:data
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#get:byteLength
  global.get $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/SELECTOR_BYTE_LENGTH
  i32.lt_s
  if
   i32.const 14512
   i32.const 12368
   i32.const 716
   i32.const 13
   call $~lib/builtins/abort
   unreachable
  end
  local.get $9
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/CallResult#get:data
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readSelector
  local.set $10
  local.get $10
  global.get $~lib/@btc-vision/btc-runtime/runtime/constants/Exports/ON_OP20_RECEIVED_SELECTOR
  i32.ne
  if
   i32.const 14512
   i32.const 12368
   i32.const 721
   i32.const 13
   call $~lib/builtins/abort
   unreachable
  end
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#_safeTransfer (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32) (param $4 i32)
  (local $5 i32)
  (local $6 i32)
  local.get $0
  local.get $1
  local.get $2
  local.get $3
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#_transfer
  block $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#isContract|inlined.0 (result i32)
   global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
   local.set $5
   local.get $2
   local.set $6
   local.get $6
   call $~lib/arraybuffer/ArrayBufferView#get:buffer
   call $~lib/@btc-vision/btc-runtime/runtime/env/global/getAccountType
   i32.const 0
   i32.ne
   br $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#isContract|inlined.0
  end
  if
   local.get $0
   local.get $1
   local.get $2
   local.get $3
   local.get $4
   call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#_callOnOP20Received
  end
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#safeTransfer (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  local.get $0
  block $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:tx|inlined.6 (result i32)
   global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
   local.set $2
   local.get $2
   call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:_tx
   i32.eqz
   if
    i32.const 11968
    i32.const 5536
    i32.const 145
    i32.const 13
    call $~lib/builtins/abort
    unreachable
   end
   local.get $2
   call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:_tx
   local.tee $3
   if (result i32)
    local.get $3
   else
    i32.const 9408
    i32.const 5536
    i32.const 147
    i32.const 16
    call $~lib/builtins/abort
    unreachable
   end
   br $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:tx|inlined.6
  end
  call $~lib/@btc-vision/btc-runtime/runtime/env/classes/Transaction/Transaction#get:sender
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readAddress
  local.get $1
  i32.const 1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readU256
  local.get $1
  i32.const 1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readBytesWithLength
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#_safeTransfer
  i32.const 0
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#constructor
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#safeTransferFrom (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readAddress
  local.set $2
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readAddress
  local.set $3
  local.get $1
  i32.const 1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readU256
  local.set $4
  local.get $1
  i32.const 1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readBytesWithLength
  local.set $5
  local.get $0
  local.get $2
  block $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:tx|inlined.8 (result i32)
   global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
   local.set $6
   local.get $6
   call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:_tx
   i32.eqz
   if
    i32.const 11968
    i32.const 5536
    i32.const 145
    i32.const 13
    call $~lib/builtins/abort
    unreachable
   end
   local.get $6
   call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:_tx
   local.tee $7
   if (result i32)
    local.get $7
   else
    i32.const 9408
    i32.const 5536
    i32.const 147
    i32.const 16
    call $~lib/builtins/abort
    unreachable
   end
   br $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:tx|inlined.8
  end
  call $~lib/@btc-vision/btc-runtime/runtime/env/classes/Transaction/Transaction#get:sender
  local.get $4
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#_spendAllowance
  local.get $0
  local.get $2
  local.get $3
  local.get $4
  local.get $5
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#_safeTransfer
  i32.const 0
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#constructor
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/events/predefined/ApprovedEvent/ApprovedEvent#constructor (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32) (result i32)
  (local $4 i32)
  local.get $0
  i32.eqz
  if
   i32.const 12
   i32.const 63
   call $~lib/rt/stub/__new
   local.set $0
  end
  i32.const 0
  global.get $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/ADDRESS_BYTE_LENGTH
  i32.const 2
  i32.mul
  global.get $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/U256_BYTE_LENGTH
  i32.add
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#constructor
  local.set $4
  local.get $4
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeAddress
  local.get $4
  local.get $2
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeAddress
  local.get $4
  local.get $3
  i32.const 1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeU256
  local.get $0
  i32.const 14720
  local.get $4
  call $~lib/@btc-vision/btc-runtime/runtime/events/NetEvent/NetEvent#constructor
  local.set $0
  local.get $0
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#createApprovedEvent (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32)
  local.get $0
  i32.const 0
  local.get $1
  local.get $2
  local.get $3
  call $~lib/@btc-vision/btc-runtime/runtime/events/predefined/ApprovedEvent/ApprovedEvent#constructor
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP_NET/OP_NET#emitEvent
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#_increaseAllowance (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  (local $10 i32)
  (local $11 i32)
  (local $12 i32)
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/types/Address/Address.zero
  call $~lib/@btc-vision/btc-runtime/runtime/types/Address/Address#equals
  if
   i32.const 14592
   i32.const 12368
   i32.const 862
   i32.const 13
   call $~lib/builtins/abort
   unreachable
  end
  local.get $2
  call $~lib/@btc-vision/btc-runtime/runtime/types/Address/Address.zero
  call $~lib/@btc-vision/btc-runtime/runtime/types/Address/Address#equals
  if
   i32.const 14656
   i32.const 12368
   i32.const 865
   i32.const 13
   call $~lib/builtins/abort
   unreachable
  end
  block $~lib/@btc-vision/btc-runtime/runtime/memory/MapOfMap/MapOfMap<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>#get|inlined.2 (result i32)
   local.get $0
   call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#get:allowanceMap
   local.set $4
   local.get $1
   local.set $5
   local.get $4
   local.set $6
   local.get $5
   local.set $7
   block $"~lib/@btc-vision/btc-runtime/runtime/generic/Map/Map<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address,~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#has|inlined.3" (result i32)
    local.get $6
    local.set $8
    local.get $7
    local.set $9
    local.get $8
    local.get $9
    call $"~lib/@btc-vision/btc-runtime/runtime/generic/Map/Map<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address,~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#indexOf@override"
    i32.const -1
    i32.ne
    br $"~lib/@btc-vision/btc-runtime/runtime/generic/Map/Map<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address,~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#has|inlined.3"
   end
   i32.eqz
   if
    local.get $6
    local.get $7
    i32.const 0
    local.get $7
    local.get $6
    call $~lib/@btc-vision/btc-runtime/runtime/memory/MapOfMap/MapOfMap<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>#get:pointer
    call $~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>#constructor
    call $"~lib/@btc-vision/btc-runtime/runtime/generic/Map/Map<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address,~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#set"
    drop
   end
   local.get $4
   local.get $5
   call $"~lib/@btc-vision/btc-runtime/runtime/generic/Map/Map<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address,~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#get"
   br $~lib/@btc-vision/btc-runtime/runtime/memory/MapOfMap/MapOfMap<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>#get|inlined.2
  end
  local.set $10
  local.get $10
  local.get $2
  call $~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>#get
  local.set $11
  local.get $11
  local.get $3
  call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.add
  local.set $12
  local.get $12
  local.get $11
  call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.lt
  if
   block $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.get:Max|inlined.1 (result i32)
    i32.const 0
    i64.const -1
    i64.const -1
    i64.const -1
    i64.const -1
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#constructor
    br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.get:Max|inlined.1
   end
   local.set $12
  end
  local.get $10
  local.get $2
  local.get $12
  call $~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>#set
  drop
  local.get $0
  local.get $1
  local.get $2
  local.get $12
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#createApprovedEvent
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#increaseAllowance (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  block $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:tx|inlined.9 (result i32)
   global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
   local.set $2
   local.get $2
   call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:_tx
   i32.eqz
   if
    i32.const 11968
    i32.const 5536
    i32.const 145
    i32.const 13
    call $~lib/builtins/abort
    unreachable
   end
   local.get $2
   call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:_tx
   local.tee $3
   if (result i32)
    local.get $3
   else
    i32.const 9408
    i32.const 5536
    i32.const 147
    i32.const 16
    call $~lib/builtins/abort
    unreachable
   end
   br $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:tx|inlined.9
  end
  call $~lib/@btc-vision/btc-runtime/runtime/env/classes/Transaction/Transaction#get:sender
  local.set $4
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readAddress
  local.set $5
  local.get $1
  i32.const 1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readU256
  local.set $6
  local.get $0
  local.get $4
  local.get $5
  local.get $6
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#_increaseAllowance
  i32.const 0
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#constructor
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#_decreaseAllowance (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  (local $10 i32)
  (local $11 i32)
  (local $12 i32)
  (local $13 i32)
  (local $14 i32)
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/types/Address/Address.zero
  call $~lib/@btc-vision/btc-runtime/runtime/types/Address/Address#equals
  if
   i32.const 14592
   i32.const 12368
   i32.const 887
   i32.const 13
   call $~lib/builtins/abort
   unreachable
  end
  local.get $2
  call $~lib/@btc-vision/btc-runtime/runtime/types/Address/Address.zero
  call $~lib/@btc-vision/btc-runtime/runtime/types/Address/Address#equals
  if
   i32.const 14656
   i32.const 12368
   i32.const 890
   i32.const 13
   call $~lib/builtins/abort
   unreachable
  end
  block $~lib/@btc-vision/btc-runtime/runtime/memory/MapOfMap/MapOfMap<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>#get|inlined.3 (result i32)
   local.get $0
   call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#get:allowanceMap
   local.set $4
   local.get $1
   local.set $5
   local.get $4
   local.set $6
   local.get $5
   local.set $7
   block $"~lib/@btc-vision/btc-runtime/runtime/generic/Map/Map<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address,~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#has|inlined.4" (result i32)
    local.get $6
    local.set $8
    local.get $7
    local.set $9
    local.get $8
    local.get $9
    call $"~lib/@btc-vision/btc-runtime/runtime/generic/Map/Map<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address,~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#indexOf@override"
    i32.const -1
    i32.ne
    br $"~lib/@btc-vision/btc-runtime/runtime/generic/Map/Map<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address,~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#has|inlined.4"
   end
   i32.eqz
   if
    local.get $6
    local.get $7
    i32.const 0
    local.get $7
    local.get $6
    call $~lib/@btc-vision/btc-runtime/runtime/memory/MapOfMap/MapOfMap<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>#get:pointer
    call $~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>#constructor
    call $"~lib/@btc-vision/btc-runtime/runtime/generic/Map/Map<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address,~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#set"
    drop
   end
   local.get $4
   local.get $5
   call $"~lib/@btc-vision/btc-runtime/runtime/generic/Map/Map<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address,~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#get"
   br $~lib/@btc-vision/btc-runtime/runtime/memory/MapOfMap/MapOfMap<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>#get|inlined.3
  end
  local.set $10
  local.get $10
  local.get $2
  call $~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>#get
  local.set $11
  block $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.gt|inlined.1 (result i32)
   local.get $3
   local.set $13
   local.get $11
   local.set $14
   local.get $14
   local.get $13
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.lt
   br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.gt|inlined.1
  end
  if
   block $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.get:Zero|inlined.14 (result i32)
    i32.const 0
    i64.const 0
    i64.const 0
    i64.const 0
    i64.const 0
    call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#constructor
    br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.get:Zero|inlined.14
   end
   local.set $12
  else
   local.get $11
   local.get $3
   call $~lib/@btc-vision/btc-runtime/runtime/types/SafeMath/SafeMath.sub
   local.set $12
  end
  local.get $10
  local.get $2
  local.get $12
  call $~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>#set
  drop
  local.get $0
  local.get $1
  local.get $2
  local.get $12
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#createApprovedEvent
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#decreaseAllowance (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  block $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:tx|inlined.10 (result i32)
   global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
   local.set $2
   local.get $2
   call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:_tx
   i32.eqz
   if
    i32.const 11968
    i32.const 5536
    i32.const 145
    i32.const 13
    call $~lib/builtins/abort
    unreachable
   end
   local.get $2
   call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:_tx
   local.tee $3
   if (result i32)
    local.get $3
   else
    i32.const 9408
    i32.const 5536
    i32.const 147
    i32.const 16
    call $~lib/builtins/abort
    unreachable
   end
   br $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:tx|inlined.10
  end
  call $~lib/@btc-vision/btc-runtime/runtime/env/classes/Transaction/Transaction#get:sender
  local.set $4
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readAddress
  local.set $5
  local.get $1
  i32.const 1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readU256
  local.set $6
  local.get $0
  local.get $4
  local.get $5
  local.get $6
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#_decreaseAllowance
  i32.const 0
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#constructor
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:_block (param $0 i32) (result i32)
  local.get $0
  i32.load offset=20
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/classes/Block/Block#get:number (param $0 i32) (result i64)
  local.get $0
  i64.load offset=8
 )
 (func $~lib/dataview/DataView#setUint64 (param $0 i32) (param $1 i32) (param $2 i64) (param $3 i32)
  local.get $1
  i32.const 31
  i32.shr_u
  local.get $1
  i32.const 8
  i32.add
  local.get $0
  call $~lib/dataview/DataView#get:byteLength
  i32.gt_s
  i32.or
  if
   i32.const 3056
   i32.const 8672
   i32.const 174
   i32.const 7
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  call $~lib/dataview/DataView#get:dataStart
  local.get $1
  i32.add
  local.get $3
  if (result i64)
   local.get $2
  else
   local.get $2
   call $~lib/polyfills/bswap<u64>
  end
  i64.store
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeU64 (param $0 i32) (param $1 i64) (param $2 i32)
  local.get $0
  global.get $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/U64_BYTE_LENGTH
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#allocSafe
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#get:buffer
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#get:currentOffset
  local.get $1
  i64.const 0
  i64.ne
  if (result i64)
   local.get $1
  else
   i64.const 0
  end
  local.get $2
  i32.eqz
  call $~lib/dataview/DataView#setUint64
  local.get $0
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#get:currentOffset
  global.get $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/U64_BYTE_LENGTH
  i32.add
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#set:currentOffset
 )
 (func $~lib/polyfills/bswap<u16> (param $0 i32) (result i32)
  i32.const 1
  drop
  i32.const 2
  i32.const 1
  i32.eq
  drop
  i32.const 2
  i32.const 2
  i32.eq
  drop
  local.get $0
  i32.const 8
  i32.const 15
  i32.and
  i32.shl
  local.get $0
  i32.const 65535
  i32.and
  i32.const 8
  i32.const 15
  i32.and
  i32.shr_u
  i32.or
  return
 )
 (func $~lib/dataview/DataView#setUint16 (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32)
  local.get $1
  i32.const 31
  i32.shr_u
  local.get $1
  i32.const 2
  i32.add
  local.get $0
  call $~lib/dataview/DataView#get:byteLength
  i32.gt_s
  i32.or
  if
   i32.const 3056
   i32.const 8672
   i32.const 135
   i32.const 7
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  call $~lib/dataview/DataView#get:dataStart
  local.get $1
  i32.add
  local.get $3
  if (result i32)
   local.get $2
  else
   local.get $2
   call $~lib/polyfills/bswap<u16>
  end
  i32.store16
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeU16 (param $0 i32) (param $1 i32) (param $2 i32)
  local.get $0
  global.get $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/U16_BYTE_LENGTH
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#allocSafe
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#get:buffer
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#get:currentOffset
  local.get $1
  local.get $2
  i32.eqz
  call $~lib/dataview/DataView#setUint16
  local.get $0
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#get:currentOffset
  global.get $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/U16_BYTE_LENGTH
  i32.add
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#set:currentOffset
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/classes/Transaction/Transaction#get:consensus (param $0 i32) (result i32)
  local.get $0
  i32.load
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/consensus/ConsensusRules/ConsensusRules#get:value (param $0 i32) (result i64)
  local.get $0
  i64.load
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/consensus/ConsensusRules/ConsensusRules#containsFlag (param $0 i32) (param $1 i64) (result i32)
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/env/consensus/ConsensusRules/ConsensusRules#get:value
  local.get $1
  i64.and
  local.get $1
  i64.eq
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/consensus/ConsensusRules/ConsensusRules#unsafeSignaturesAllowed (param $0 i32) (result i32)
  local.get $0
  global.get $~lib/@btc-vision/btc-runtime/runtime/env/consensus/ConsensusRules/ConsensusRules.UNSAFE_QUANTUM_SIGNATURES_ALLOWED
  call $~lib/@btc-vision/btc-runtime/runtime/env/consensus/ConsensusRules/ConsensusRules#containsFlag
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#internalVerifySchnorr (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32) (result i32)
  (local $4 i32)
  (local $5 i32)
  local.get $2
  call $~lib/typedarray/Uint8Array#get:length
  i32.const 64
  i32.ne
  if
   i32.const 14976
   i32.const 5536
   i32.const 1307
   i32.const 38
   call $~lib/builtins/abort
   unreachable
  end
  local.get $3
  call $~lib/typedarray/Uint8Array#get:length
  i32.const 32
  i32.ne
  if
   i32.const 15056
   i32.const 5536
   i32.const 1308
   i32.const 33
   call $~lib/builtins/abort
   unreachable
  end
  i32.const 0
  i32.const 33
  call $~lib/typedarray/Uint8Array#constructor
  local.set $4
  local.get $4
  call $~lib/arraybuffer/ArrayBufferView#get:dataStart
  local.set $5
  local.get $5
  global.get $~lib/@btc-vision/btc-runtime/runtime/env/consensus/Signatures/SignaturesMethods.Schnorr
  i32.store8
  local.get $5
  i32.const 1
  i32.add
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/types/ExtendedAddress/ExtendedAddress#get:tweakedPublicKey
  call $~lib/arraybuffer/ArrayBufferView#get:dataStart
  global.get $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/ADDRESS_BYTE_LENGTH
  memory.copy
  local.get $4
  call $~lib/arraybuffer/ArrayBufferView#get:buffer
  local.get $2
  call $~lib/arraybuffer/ArrayBufferView#get:buffer
  local.get $3
  call $~lib/arraybuffer/ArrayBufferView#get:buffer
  call $~lib/@btc-vision/btc-runtime/runtime/env/global/verifySignature
  i32.const 1
  i32.eq
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/types/Address/Address#get:_mldsaPublicKey (param $0 i32) (result i32)
  local.get $0
  i32.load offset=16
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/consensus/MLDSAMetadata/MLDSAMetadata.fromLevel (param $0 i32) (result i32)
  (local $1 i32)
  block $case3|0
   block $case2|0
    block $case1|0
     block $case0|0
      local.get $0
      local.set $1
      local.get $1
      global.get $~lib/@btc-vision/btc-runtime/runtime/env/consensus/MLDSAMetadata/MLDSASecurityLevel.Level2
      i32.eq
      br_if $case0|0
      local.get $1
      global.get $~lib/@btc-vision/btc-runtime/runtime/env/consensus/MLDSAMetadata/MLDSASecurityLevel.Level3
      i32.eq
      br_if $case1|0
      local.get $1
      global.get $~lib/@btc-vision/btc-runtime/runtime/env/consensus/MLDSAMetadata/MLDSASecurityLevel.Level5
      i32.eq
      br_if $case2|0
      br $case3|0
     end
     global.get $~lib/@btc-vision/btc-runtime/runtime/env/consensus/MLDSAMetadata/MLDSAPublicKeyMetadata.MLDSA44
     return
    end
    global.get $~lib/@btc-vision/btc-runtime/runtime/env/consensus/MLDSAMetadata/MLDSAPublicKeyMetadata.MLDSA65
    return
   end
   global.get $~lib/@btc-vision/btc-runtime/runtime/env/consensus/MLDSAMetadata/MLDSAPublicKeyMetadata.MLDSA87
   return
  end
  i32.const 15392
  i32.const 15472
  i32.const 34
  i32.const 17
  call $~lib/builtins/abort
  unreachable
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/global/loadMLDSAPublicKey (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/env/consensus/MLDSAMetadata/MLDSAMetadata.fromLevel
  local.set $2
  i32.const 0
  i32.const 1
  global.get $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/ADDRESS_BYTE_LENGTH
  i32.add
  call $~lib/typedarray/Uint8Array#constructor
  local.set $3
  local.get $3
  call $~lib/arraybuffer/ArrayBufferView#get:dataStart
  local.set $4
  local.get $4
  local.get $1
  i32.store8
  local.get $4
  i32.const 1
  i32.add
  local.get $0
  call $~lib/arraybuffer/ArrayBufferView#get:dataStart
  global.get $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/ADDRESS_BYTE_LENGTH
  memory.copy
  i32.const 0
  i32.const 1
  local.get $2
  i32.add
  call $~lib/typedarray/Uint8Array#constructor
  local.set $5
  local.get $3
  call $~lib/arraybuffer/ArrayBufferView#get:buffer
  local.get $5
  call $~lib/arraybuffer/ArrayBufferView#get:buffer
  call $~lib/@btc-vision/btc-runtime/runtime/env/global/loadMLDSA
  local.get $5
  call $~lib/arraybuffer/ArrayBufferView#get:dataStart
  i32.load8_u
  i32.const 0
  i32.eq
  if
   i32.const 15632
   i32.const 15712
   i32.const 376
   i32.const 9
   call $~lib/builtins/abort
   unreachable
  end
  local.get $5
  i32.const 1
  i32.const 1
  global.set $~argumentsLength
  i32.const 0
  call $~lib/typedarray/Uint8Array#slice@varargs
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/types/Address/Address#get:mldsaPublicKey (param $0 i32) (result i32)
  (local $1 i32)
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/types/Address/Address#get:_mldsaPublicKey
  i32.eqz
  if
   local.get $0
   local.get $0
   global.get $~lib/@btc-vision/btc-runtime/runtime/env/consensus/MLDSAMetadata/MLDSASecurityLevel.Level2
   call $~lib/@btc-vision/btc-runtime/runtime/env/global/loadMLDSAPublicKey
   call $~lib/@btc-vision/btc-runtime/runtime/types/Address/Address#set:_mldsaPublicKey
  end
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/types/Address/Address#get:_mldsaPublicKey
  local.tee $1
  if (result i32)
   local.get $1
  else
   i32.const 9408
   i32.const 2928
   i32.const 87
   i32.const 16
   call $~lib/builtins/abort
   unreachable
  end
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/consensus/MLDSAMetadata/MLDSAMetadata.signatureLen (param $0 i32) (result i32)
  (local $1 i32)
  block $case3|0
   block $case2|0
    block $case1|0
     block $case0|0
      local.get $0
      local.set $1
      local.get $1
      global.get $~lib/@btc-vision/btc-runtime/runtime/env/consensus/MLDSAMetadata/MLDSAPublicKeyMetadata.MLDSA44
      i32.eq
      br_if $case0|0
      local.get $1
      global.get $~lib/@btc-vision/btc-runtime/runtime/env/consensus/MLDSAMetadata/MLDSAPublicKeyMetadata.MLDSA65
      i32.eq
      br_if $case1|0
      local.get $1
      global.get $~lib/@btc-vision/btc-runtime/runtime/env/consensus/MLDSAMetadata/MLDSAPublicKeyMetadata.MLDSA87
      i32.eq
      br_if $case2|0
      br $case3|0
     end
     i32.const 2420
     return
    end
    i32.const 3309
    return
   end
   i32.const 4627
   return
  end
  i32.const 0
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#verifyMLDSASignature (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32) (param $4 i32) (result i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/env/consensus/MLDSAMetadata/MLDSAMetadata.fromLevel
  local.set $5
  local.get $2
  call $~lib/typedarray/Uint8Array#get:length
  local.get $5
  i32.ne
  if
   i32.const 15840
   i32.const 5536
   i32.const 867
   i32.const 13
   call $~lib/builtins/abort
   unreachable
  end
  local.get $3
  call $~lib/typedarray/Uint8Array#get:length
  local.get $5
  call $~lib/@btc-vision/btc-runtime/runtime/env/consensus/MLDSAMetadata/MLDSAMetadata.signatureLen
  i32.ne
  if
   i32.const 15936
   i32.const 5536
   i32.const 871
   i32.const 13
   call $~lib/builtins/abort
   unreachable
  end
  local.get $4
  call $~lib/typedarray/Uint8Array#get:length
  i32.const 32
  i32.ne
  if
   i32.const 15056
   i32.const 5536
   i32.const 875
   i32.const 13
   call $~lib/builtins/abort
   unreachable
  end
  i32.const 2
  local.get $2
  call $~lib/typedarray/Uint8Array#get:length
  i32.add
  local.set $6
  i32.const 0
  local.get $6
  call $~lib/typedarray/Uint8Array#constructor
  local.set $7
  local.get $7
  call $~lib/arraybuffer/ArrayBufferView#get:dataStart
  local.set $8
  local.get $8
  global.get $~lib/@btc-vision/btc-runtime/runtime/env/consensus/Signatures/SignaturesMethods.MLDSA
  i32.store8
  local.get $8
  i32.const 1
  i32.add
  local.get $1
  i32.store8
  local.get $8
  i32.const 2
  i32.add
  local.get $2
  call $~lib/arraybuffer/ArrayBufferView#get:dataStart
  local.get $2
  call $~lib/typedarray/Uint8Array#get:length
  memory.copy
  local.get $7
  call $~lib/arraybuffer/ArrayBufferView#get:buffer
  local.get $3
  call $~lib/arraybuffer/ArrayBufferView#get:buffer
  local.get $4
  call $~lib/arraybuffer/ArrayBufferView#get:buffer
  call $~lib/@btc-vision/btc-runtime/runtime/env/global/verifySignature
  local.set $9
  local.get $9
  i32.const 1
  i32.eq
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#verifySignature (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32) (param $4 i32) (result i32)
  (local $5 i32)
  (local $6 i32)
  block $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:tx|inlined.11 (result i32)
   local.get $0
   local.set $5
   local.get $5
   call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:_tx
   i32.eqz
   if
    i32.const 11968
    i32.const 5536
    i32.const 145
    i32.const 13
    call $~lib/builtins/abort
    unreachable
   end
   local.get $5
   call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:_tx
   local.tee $6
   if (result i32)
    local.get $6
   else
    i32.const 9408
    i32.const 5536
    i32.const 147
    i32.const 16
    call $~lib/builtins/abort
    unreachable
   end
   br $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:tx|inlined.11
  end
  call $~lib/@btc-vision/btc-runtime/runtime/env/classes/Transaction/Transaction#get:consensus
  call $~lib/@btc-vision/btc-runtime/runtime/env/consensus/ConsensusRules/ConsensusRules#unsafeSignaturesAllowed
  if (result i32)
   local.get $4
   global.get $~lib/@btc-vision/btc-runtime/runtime/env/consensus/Signatures/SignaturesMethods.MLDSA
   i32.ne
  else
   i32.const 0
  end
  if
   local.get $4
   global.get $~lib/@btc-vision/btc-runtime/runtime/env/consensus/Signatures/SignaturesMethods.Schnorr
   i32.eq
   if
    local.get $0
    local.get $1
    local.get $2
    local.get $3
    call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#internalVerifySchnorr
    return
   else
    local.get $4
    global.get $~lib/@btc-vision/btc-runtime/runtime/env/consensus/Signatures/SignaturesMethods.ECDSA
    i32.eq
    if
     i32.const 15120
     i32.const 5536
     i32.const 966
     i32.const 17
     call $~lib/builtins/abort
     unreachable
    end
   end
  else
   local.get $0
   global.get $~lib/@btc-vision/btc-runtime/runtime/env/consensus/MLDSAMetadata/MLDSASecurityLevel.Level2
   local.get $1
   call $~lib/@btc-vision/btc-runtime/runtime/types/Address/Address#get:mldsaPublicKey
   local.get $2
   local.get $3
   call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#verifyMLDSASignature
   return
  end
  i32.const 16032
  i32.const 5536
  i32.const 979
  i32.const 9
  call $~lib/builtins/abort
  unreachable
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#verifySignature@varargs (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32) (param $4 i32) (result i32)
  block $1of1
   block $0of1
    block $outOfRange
     global.get $~argumentsLength
     i32.const 3
     i32.sub
     br_table $0of1 $1of1 $outOfRange
    end
    unreachable
   end
   global.get $~lib/@btc-vision/btc-runtime/runtime/env/consensus/Signatures/SignaturesMethods.Schnorr
   local.set $4
  end
  local.get $0
  local.get $1
  local.get $2
  local.get $3
  local.get $4
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#verifySignature
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#_verifySignature (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32) (param $4 i32) (param $5 i64) (param $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  (local $10 i32)
  (local $11 i32)
  (local $12 i32)
  (local $13 i32)
  local.get $6
  call $~lib/typedarray/Uint8Array#get:length
  i32.const 64
  i32.ne
  if
   i32.const 14768
   i32.const 12368
   i32.const 806
   i32.const 13
   call $~lib/builtins/abort
   unreachable
  end
  block $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:block|inlined.0 (result i32)
   global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
   local.set $7
   local.get $7
   call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:_block
   i32.eqz
   if
    i32.const 14848
    i32.const 5536
    i32.const 118
    i32.const 13
    call $~lib/builtins/abort
    unreachable
   end
   local.get $7
   call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:_block
   local.tee $8
   if (result i32)
    local.get $8
   else
    i32.const 9408
    i32.const 5536
    i32.const 120
    i32.const 16
    call $~lib/builtins/abort
    unreachable
   end
   br $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:block|inlined.0
  end
  call $~lib/@btc-vision/btc-runtime/runtime/env/classes/Block/Block#get:number
  local.get $5
  i64.gt_u
  if
   i32.const 14912
   i32.const 12368
   i32.const 809
   i32.const 13
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#get:_nonceMap
  local.get $2
  call $~lib/@btc-vision/btc-runtime/runtime/memory/AddressMemoryMap/AddressMemoryMap#get
  local.set $9
  i32.const 0
  i32.const 32
  global.get $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/ADDRESS_BYTE_LENGTH
  i32.const 2
  i32.mul
  i32.add
  global.get $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/U256_BYTE_LENGTH
  i32.const 2
  i32.mul
  i32.add
  global.get $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/U64_BYTE_LENGTH
  i32.add
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#constructor
  local.set $10
  local.get $10
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeBytesU8Array
  local.get $10
  local.get $2
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeAddress
  local.get $10
  local.get $3
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeAddress
  local.get $10
  local.get $4
  i32.const 1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeU256
  local.get $10
  local.get $9
  i32.const 1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeU256
  local.get $10
  local.get $5
  i32.const 1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeU64
  local.get $10
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#getBuffer
  call $~lib/@btc-vision/btc-runtime/runtime/env/global/sha256
  local.set $11
  i32.const 0
  i32.const 2
  i32.const 32
  i32.add
  i32.const 32
  i32.add
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#constructor
  local.set $12
  local.get $12
  i32.const 6401
  i32.const 1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeU16
  local.get $12
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#_buildDomainSeparator
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeBytes
  local.get $12
  local.get $11
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeBytes
  local.get $12
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#getBuffer
  call $~lib/@btc-vision/btc-runtime/runtime/env/global/sha256
  local.set $13
  global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
  local.get $2
  local.get $6
  local.get $13
  i32.const 3
  global.set $~argumentsLength
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#verifySignature@varargs
  i32.eqz
  if
   i32.const 16224
   i32.const 12368
   i32.const 834
   i32.const 13
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#get:_nonceMap
  local.get $2
  local.get $9
  block $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.get:One|inlined.10 (result i32)
   i32.const 0
   i64.const 1
   i64.const 0
   i64.const 0
   i64.const 0
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#constructor
   br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.get:One|inlined.10
  end
  call $~lib/@btc-vision/btc-runtime/runtime/types/SafeMath/SafeMath.add
  call $~lib/@btc-vision/btc-runtime/runtime/memory/AddressMemoryMap/AddressMemoryMap#set
  drop
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#_increaseAllowanceBySignature (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32) (param $4 i64) (param $5 i32)
  local.get $0
  global.get $~lib/@btc-vision/btc-runtime/runtime/constants/Exports/ALLOWANCE_INCREASE_TYPE_HASH
  local.get $1
  local.get $2
  local.get $3
  local.get $4
  local.get $5
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#_verifySignature
  local.get $0
  local.get $1
  local.get $2
  local.get $3
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#_increaseAllowance
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#increaseAllowanceBySignature (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  (local $10 i32)
  (local $11 i32)
  (local $12 i32)
  (local $13 i32)
  (local $14 i32)
  (local $15 i64)
  (local $16 i32)
  block $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readBytesArray|inlined.3 (result i32)
   local.get $1
   local.set $2
   global.get $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/ADDRESS_BYTE_LENGTH
   local.set $3
   i32.const 0
   local.get $3
   call $~lib/array/Array<u8>#constructor
   local.set $4
   i32.const 0
   local.set $5
   loop $for-loop|0
    local.get $5
    local.get $3
    i32.lt_s
    if
     local.get $4
     local.get $5
     local.get $2
     call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readU8
     call $~lib/array/Array<u8>#__set
     local.get $5
     i32.const 1
     i32.add
     local.set $5
     br $for-loop|0
    end
   end
   local.get $4
   br $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readBytesArray|inlined.3
  end
  local.set $6
  block $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readBytesArray|inlined.4 (result i32)
   local.get $1
   local.set $7
   global.get $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/ADDRESS_BYTE_LENGTH
   local.set $8
   i32.const 0
   local.get $8
   call $~lib/array/Array<u8>#constructor
   local.set $9
   i32.const 0
   local.set $10
   loop $for-loop|1
    local.get $10
    local.get $8
    i32.lt_s
    if
     local.get $9
     local.get $10
     local.get $7
     call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readU8
     call $~lib/array/Array<u8>#__set
     local.get $10
     i32.const 1
     i32.add
     local.set $10
     br $for-loop|1
    end
   end
   local.get $9
   br $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readBytesArray|inlined.4
  end
  local.set $11
  i32.const 0
  local.get $11
  local.get $6
  call $~lib/@btc-vision/btc-runtime/runtime/types/ExtendedAddress/ExtendedAddress#constructor
  local.set $12
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readAddress
  local.set $13
  local.get $1
  i32.const 1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readU256
  local.set $14
  local.get $1
  i32.const 1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readU64
  local.set $15
  local.get $1
  i32.const 1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readBytesWithLength
  local.set $16
  local.get $0
  local.get $12
  local.get $13
  local.get $14
  local.get $15
  local.get $16
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#_increaseAllowanceBySignature
  i32.const 0
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#constructor
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#_decreaseAllowanceBySignature (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32) (param $4 i64) (param $5 i32)
  local.get $0
  global.get $~lib/@btc-vision/btc-runtime/runtime/constants/Exports/ALLOWANCE_DECREASE_TYPE_HASH
  local.get $1
  local.get $2
  local.get $3
  local.get $4
  local.get $5
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#_verifySignature
  local.get $0
  local.get $1
  local.get $2
  local.get $3
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#_decreaseAllowance
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#decreaseAllowanceBySignature (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  (local $10 i32)
  (local $11 i32)
  (local $12 i32)
  (local $13 i32)
  (local $14 i32)
  (local $15 i64)
  (local $16 i32)
  block $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readBytesArray|inlined.5 (result i32)
   local.get $1
   local.set $2
   global.get $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/ADDRESS_BYTE_LENGTH
   local.set $3
   i32.const 0
   local.get $3
   call $~lib/array/Array<u8>#constructor
   local.set $4
   i32.const 0
   local.set $5
   loop $for-loop|0
    local.get $5
    local.get $3
    i32.lt_s
    if
     local.get $4
     local.get $5
     local.get $2
     call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readU8
     call $~lib/array/Array<u8>#__set
     local.get $5
     i32.const 1
     i32.add
     local.set $5
     br $for-loop|0
    end
   end
   local.get $4
   br $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readBytesArray|inlined.5
  end
  local.set $6
  block $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readBytesArray|inlined.6 (result i32)
   local.get $1
   local.set $7
   global.get $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/ADDRESS_BYTE_LENGTH
   local.set $8
   i32.const 0
   local.get $8
   call $~lib/array/Array<u8>#constructor
   local.set $9
   i32.const 0
   local.set $10
   loop $for-loop|1
    local.get $10
    local.get $8
    i32.lt_s
    if
     local.get $9
     local.get $10
     local.get $7
     call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readU8
     call $~lib/array/Array<u8>#__set
     local.get $10
     i32.const 1
     i32.add
     local.set $10
     br $for-loop|1
    end
   end
   local.get $9
   br $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readBytesArray|inlined.6
  end
  local.set $11
  i32.const 0
  local.get $11
  local.get $6
  call $~lib/@btc-vision/btc-runtime/runtime/types/ExtendedAddress/ExtendedAddress#constructor
  local.set $12
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readAddress
  local.set $13
  local.get $1
  i32.const 1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readU256
  local.set $14
  local.get $1
  i32.const 1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readU64
  local.set $15
  local.get $1
  i32.const 1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readBytesWithLength
  local.set $16
  local.get $0
  local.get $12
  local.get $13
  local.get $14
  local.get $15
  local.get $16
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#_decreaseAllowanceBySignature
  i32.const 0
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#constructor
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#burn (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  local.get $0
  block $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:tx|inlined.12 (result i32)
   global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
   local.set $2
   local.get $2
   call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:_tx
   i32.eqz
   if
    i32.const 11968
    i32.const 5536
    i32.const 145
    i32.const 13
    call $~lib/builtins/abort
    unreachable
   end
   local.get $2
   call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:_tx
   local.tee $3
   if (result i32)
    local.get $3
   else
    i32.const 9408
    i32.const 5536
    i32.const 147
    i32.const 16
    call $~lib/builtins/abort
    unreachable
   end
   br $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:tx|inlined.12
  end
  call $~lib/@btc-vision/btc-runtime/runtime/env/classes/Transaction/Transaction#get:sender
  local.get $1
  i32.const 1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readU256
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#_burn
  i32.const 0
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#constructor
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#metadata (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  (local $10 i32)
  (local $11 i32)
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#get:_name
  call $~lib/@btc-vision/btc-runtime/runtime/storage/BaseStoredString/BaseStoredString#get:value
  local.set $2
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#get:_symbol
  call $~lib/@btc-vision/btc-runtime/runtime/storage/BaseStoredString/BaseStoredString#get:value
  local.set $3
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#get:_icon
  call $~lib/@btc-vision/btc-runtime/runtime/storage/BaseStoredString/BaseStoredString#get:value
  local.set $4
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#_buildDomainSeparator
  local.set $5
  local.get $2
  i32.const 0
  call $~lib/string/String.UTF8.byteLength
  local.set $6
  local.get $3
  i32.const 0
  call $~lib/string/String.UTF8.byteLength
  local.set $7
  local.get $4
  i32.const 0
  call $~lib/string/String.UTF8.byteLength
  local.set $8
  global.get $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/U32_BYTE_LENGTH
  i32.const 4
  i32.mul
  global.get $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/U256_BYTE_LENGTH
  i32.const 2
  i32.mul
  i32.add
  local.get $6
  i32.add
  local.get $7
  i32.add
  local.get $8
  i32.add
  local.get $5
  call $~lib/typedarray/Uint8Array#get:length
  i32.add
  global.get $~lib/@btc-vision/btc-runtime/runtime/utils/lengths/U8_BYTE_LENGTH
  i32.add
  local.set $9
  i32.const 0
  local.get $9
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#constructor
  local.set $10
  local.get $10
  local.get $2
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeStringWithLength
  local.get $10
  local.get $3
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeStringWithLength
  local.get $10
  local.get $4
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeStringWithLength
  local.get $10
  block $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#toU32|inlined.1 (result i32)
   local.get $0
   call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#get:_decimals
   call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredU256/StoredU256#get:value
   local.set $11
   local.get $11
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo1
   i32.wrap_i64
   br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#toU32|inlined.1
  end
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeU8
  local.get $10
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#get:_totalSupply
  call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredU256/StoredU256#get:value
  i32.const 1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeU256
  local.get $10
  local.get $5
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesWriter/BytesWriter#writeBytesWithLength
  local.get $10
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#execute (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  local.get $1
  i32.const 360839196
  i32.eq
  if
   local.get $0
   local.get $2
   call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#name
   return
  end
  local.get $1
  i32.const 630619301
  i32.eq
  if
   local.get $0
   local.get $2
   call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#symbol
   return
  end
  local.get $1
  i32.const -1431678779
  i32.eq
  if
   local.get $0
   local.get $2
   call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#icon
   return
  end
  local.get $1
  i32.const -1148959680
  i32.eq
  if
   local.get $0
   local.get $2
   call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#decimals
   return
  end
  local.get $1
  i32.const -1553464786
  i32.eq
  if
   local.get $0
   local.get $2
   call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#totalSupply
   return
  end
  local.get $1
  i32.const 2106413081
  i32.eq
  if
   local.get $0
   local.get $2
   call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#maximumSupply
   return
  end
  local.get $1
  i32.const -239107872
  i32.eq
  if
   local.get $0
   local.get $2
   call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#domainSeparator
   return
  end
  local.get $1
  i32.const 1531377910
  i32.eq
  if
   local.get $0
   local.get $2
   call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#balanceOf
   return
  end
  local.get $1
  i32.const -159233179
  i32.eq
  if
   local.get $0
   local.get $2
   call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#nonceOf
   return
  end
  local.get $1
  i32.const -664487990
  i32.eq
  if
   local.get $0
   local.get $2
   call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#allowance
   return
  end
  local.get $1
  i32.const 998829911
  i32.eq
  if
   local.get $0
   local.get $2
   call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#transfer
   return
  end
  local.get $1
  i32.const 1265010151
  i32.eq
  if
   local.get $0
   local.get $2
   call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#transferFrom
   return
  end
  local.get $1
  i32.const -160920984
  i32.eq
  if
   local.get $0
   local.get $2
   call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#safeTransfer
   return
  end
  local.get $1
  i32.const 1769024148
  i32.eq
  if
   local.get $0
   local.get $2
   call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#safeTransferFrom
   return
  end
  local.get $1
  i32.const -1922803933
  i32.eq
  if
   local.get $0
   local.get $2
   call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#increaseAllowance
   return
  end
  local.get $1
  i32.const -1509908001
  i32.eq
  if
   local.get $0
   local.get $2
   call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#decreaseAllowance
   return
  end
  local.get $1
  i32.const 930580552
  i32.eq
  if
   local.get $0
   local.get $2
   call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#increaseAllowanceBySignature
   return
  end
  local.get $1
  i32.const 1567548012
  i32.eq
  if
   local.get $0
   local.get $2
   call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#decreaseAllowanceBySignature
   return
  end
  local.get $1
  i32.const 814599775
  i32.eq
  if
   local.get $0
   local.get $2
   call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#burn
   return
  end
  local.get $1
  i32.const -66252452
  i32.eq
  if
   local.get $0
   local.get $2
   call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#metadata
   return
  end
  local.get $0
  local.get $1
  local.get $2
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP_NET/OP_NET#execute
  return
 )
 (func $src/wrapped/husdt/HUSDT/HUSDT#execute (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  local.get $1
  i32.const 961601633
  i32.eq
  if
   local.get $0
   local.get $2
   call $src/wrapped/husdt/HUSDT/HUSDT#mint
   return
  end
  local.get $1
  i32.const 373731644
  i32.eq
  if
   local.get $0
   local.get $2
   call $src/wrapped/husdt/HUSDT/HUSDT#burnFrom
   return
  end
  local.get $1
  i32.const -713154143
  i32.eq
  if
   local.get $0
   local.get $2
   call $src/wrapped/husdt/HUSDT/HUSDT#setBridgeAuthority
   return
  end
  local.get $1
  i32.const 1464909524
  i32.eq
  if
   local.get $0
   local.get $2
   call $src/wrapped/husdt/HUSDT/HUSDT#bridgeAuthority
   return
  end
  local.get $0
  local.get $1
  local.get $2
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#execute
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/ReentrancyGuard/ReentrancyGuard#nonReentrantAfter (param $0 i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/ReentrancyGuard/ReentrancyGuard#get:reentrancyLevel
  global.get $~lib/@btc-vision/btc-runtime/runtime/contracts/ReentrancyGuard/ReentrancyLevel.STANDARD
  i32.eq
  if
   local.get $0
   call $~lib/@btc-vision/btc-runtime/runtime/contracts/ReentrancyGuard/ReentrancyGuard#get:_locked
   i32.const 0
   call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredBoolean/StoredBoolean#set:value
  else
   local.get $0
   call $~lib/@btc-vision/btc-runtime/runtime/contracts/ReentrancyGuard/ReentrancyGuard#get:reentrancyLevel
   global.get $~lib/@btc-vision/btc-runtime/runtime/contracts/ReentrancyGuard/ReentrancyLevel.CALLBACK
   i32.eq
   if
    local.get $0
    call $~lib/@btc-vision/btc-runtime/runtime/contracts/ReentrancyGuard/ReentrancyGuard#get:_reentrancyDepth
    call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredU256/StoredU256#get:value
    local.set $1
    block $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#isZero|inlined.6 (result i32)
     local.get $1
     local.set $2
     local.get $2
     call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo1
     local.get $2
     call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo2
     i64.or
     local.get $2
     call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi1
     i64.or
     local.get $2
     call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi2
     i64.or
     i64.const 0
     i64.ne
     i32.eqz
     br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#isZero|inlined.6
    end
    if
     i32.const 16288
     i32.const 11632
     i32.const 100
     i32.const 17
     call $~lib/builtins/abort
     unreachable
    end
    local.get $1
    block $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.get:One|inlined.11 (result i32)
     i32.const 0
     i64.const 1
     i64.const 0
     i64.const 0
     i64.const 0
     call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#constructor
     br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.get:One|inlined.11
    end
    call $~lib/@btc-vision/btc-runtime/runtime/types/SafeMath/SafeMath.sub
    local.set $3
    local.get $0
    call $~lib/@btc-vision/btc-runtime/runtime/contracts/ReentrancyGuard/ReentrancyGuard#get:_reentrancyDepth
    local.get $3
    call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredU256/StoredU256#set:value
    block $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#isZero|inlined.7 (result i32)
     local.get $3
     local.set $4
     local.get $4
     call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo1
     local.get $4
     call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo2
     i64.or
     local.get $4
     call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi1
     i64.or
     local.get $4
     call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi2
     i64.or
     i64.const 0
     i64.ne
     i32.eqz
     br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#isZero|inlined.7
    end
    if
     local.get $0
     call $~lib/@btc-vision/btc-runtime/runtime/contracts/ReentrancyGuard/ReentrancyGuard#get:_locked
     i32.const 0
     call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredBoolean/StoredBoolean#set:value
    end
   end
  end
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/ReentrancyGuard/ReentrancyGuard#onExecutionCompleted (param $0 i32) (param $1 i32) (param $2 i32)
  local.get $0
  local.get $1
  local.get $2
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP_NET/OP_NET#onExecutionCompleted
  local.get $0
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/ReentrancyGuard/ReentrancyGuard#isSelectorExcluded@override
  if
   return
  end
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/ReentrancyGuard/ReentrancyGuard#nonReentrantAfter
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/interfaces/OP20InitParameters/OP20InitParameters#set:maxSupply (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store
  local.get $0
  local.get $1
  i32.const 0
  call $~lib/rt/stub/__link
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/interfaces/OP20InitParameters/OP20InitParameters#set:decimals (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store8 offset=4
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/interfaces/OP20InitParameters/OP20InitParameters#set:name (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=8
  local.get $0
  local.get $1
  i32.const 0
  call $~lib/rt/stub/__link
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/interfaces/OP20InitParameters/OP20InitParameters#set:symbol (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=12
  local.get $0
  local.get $1
  i32.const 0
  call $~lib/rt/stub/__link
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/interfaces/OP20InitParameters/OP20InitParameters#set:icon (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=16
  local.get $0
  local.get $1
  i32.const 0
  call $~lib/rt/stub/__link
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/interfaces/OP20InitParameters/OP20InitParameters#constructor (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32) (param $4 i32) (param $5 i32) (result i32)
  local.get $0
  i32.eqz
  if
   i32.const 20
   i32.const 64
   call $~lib/rt/stub/__new
   local.set $0
  end
  local.get $0
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/interfaces/OP20InitParameters/OP20InitParameters#set:maxSupply
  local.get $0
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/interfaces/OP20InitParameters/OP20InitParameters#set:decimals
  local.get $0
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/interfaces/OP20InitParameters/OP20InitParameters#set:name
  local.get $0
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/interfaces/OP20InitParameters/OP20InitParameters#set:symbol
  local.get $0
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/interfaces/OP20InitParameters/OP20InitParameters#set:icon
  local.get $0
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/interfaces/OP20InitParameters/OP20InitParameters#set:maxSupply
  local.get $0
  local.get $2
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/interfaces/OP20InitParameters/OP20InitParameters#set:decimals
  local.get $0
  local.get $3
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/interfaces/OP20InitParameters/OP20InitParameters#set:name
  local.get $0
  local.get $4
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/interfaces/OP20InitParameters/OP20InitParameters#set:symbol
  local.get $0
  local.get $5
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/interfaces/OP20InitParameters/OP20InitParameters#set:icon
  local.get $0
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/types/Address/Address#notEquals (param $0 i32) (param $1 i32) (result i32)
  local.get $0
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/types/Address/Address#equals
  i32.eqz
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP_NET/OP_NET#onlyDeployer (param $0 i32) (param $1 i32)
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP_NET/OP_NET#get:contractDeployer
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/types/Address/Address#notEquals
  if
   i32.const 16544
   i32.const 11088
   i32.const 132
   i32.const 13
   call $~lib/builtins/abort
   unreachable
  end
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/interfaces/OP20InitParameters/OP20InitParameters#get:decimals (param $0 i32) (result i32)
  local.get $0
  i32.load8_u offset=4
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/interfaces/OP20InitParameters/OP20InitParameters#get:maxSupply (param $0 i32) (result i32)
  local.get $0
  i32.load
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/interfaces/OP20InitParameters/OP20InitParameters#get:name (param $0 i32) (result i32)
  local.get $0
  i32.load offset=8
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/storage/BaseStoredString/BaseStoredString#getStoredLength (param $0 i32) (result i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
  local.get $0
  i64.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/storage/BaseStoredString/BaseStoredString#getPointer
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#getStorageAt
  local.set $1
  local.get $1
  i32.const 0
  call $~lib/typedarray/Uint8Array#__get
  local.set $2
  local.get $1
  i32.const 1
  call $~lib/typedarray/Uint8Array#__get
  local.set $3
  local.get $1
  i32.const 2
  call $~lib/typedarray/Uint8Array#__get
  local.set $4
  local.get $1
  i32.const 3
  call $~lib/typedarray/Uint8Array#__get
  local.set $5
  local.get $2
  i32.const 24
  i32.shl
  local.get $3
  i32.const 16
  i32.shl
  i32.or
  local.get $4
  i32.const 8
  i32.shl
  i32.or
  local.get $5
  i32.or
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/storage/BaseStoredString/BaseStoredString#clearOldStorage (param $0 i32) (param $1 i32)
  (local $2 i64)
  (local $3 i64)
  (local $4 i64)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  local.get $1
  i32.const 0
  i32.eq
  if
   return
  end
  i64.const 1
  local.set $2
  local.get $1
  i32.const 28
  i32.gt_u
  if (result i64)
   local.get $1
   i32.const 28
   i32.sub
   i64.extend_i32_u
  else
   i64.const 0
  end
  local.set $3
  local.get $3
  i64.const 0
  i64.gt_u
  if
   local.get $2
   local.get $3
   i64.const 32
   i64.add
   i64.const 1
   i64.sub
   i64.const 32
   i64.div_u
   i64.add
   local.set $2
  end
  i64.const 0
  local.set $4
  loop $for-loop|0
   local.get $4
   local.get $2
   i64.lt_u
   if
    global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
    local.set $5
    local.get $0
    local.get $4
    call $~lib/@btc-vision/btc-runtime/runtime/storage/BaseStoredString/BaseStoredString#getPointer
    local.set $6
    i32.const 0
    i32.const 32
    call $~lib/typedarray/Uint8Array#constructor
    local.set $7
    local.get $5
    local.get $6
    local.get $7
    call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#_internalSetStorageAt
    local.get $4
    i64.const 1
    i64.add
    local.set $4
    br $for-loop|0
   end
  end
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/storage/BaseStoredString/BaseStoredString#get:MAX_LENGTH (param $0 i32) (result i32)
  local.get $0
  i32.load
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/storage/BaseStoredString/BaseStoredString#save (param $0 i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  (local $10 i32)
  (local $11 i32)
  (local $12 i32)
  (local $13 i32)
  (local $14 i32)
  (local $15 i32)
  (local $16 i32)
  (local $17 i32)
  (local $18 i64)
  (local $19 i32)
  (local $20 i32)
  (local $21 i32)
  (local $22 i32)
  (local $23 i32)
  (local $24 i32)
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/storage/BaseStoredString/BaseStoredString#getStoredLength
  local.set $1
  local.get $0
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/storage/BaseStoredString/BaseStoredString#clearOldStorage
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/storage/BaseStoredString/BaseStoredString#get:_value
  i32.const 0
  i32.const 2
  global.set $~argumentsLength
  i32.const 0
  call $~lib/string/String.UTF8.encode@varargs
  local.set $2
  local.get $2
  call $~lib/arraybuffer/ArrayBuffer#get:byteLength
  local.set $3
  local.get $3
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/storage/BaseStoredString/BaseStoredString#get:MAX_LENGTH
  i32.gt_u
  if
   local.get $0
   call $~lib/@btc-vision/btc-runtime/runtime/storage/BaseStoredString/BaseStoredString#getClassName@override
   local.set $4
   local.get $0
   call $~lib/@btc-vision/btc-runtime/runtime/storage/BaseStoredString/BaseStoredString#get:MAX_LENGTH
   i32.const 10
   call $~lib/number/U32#toString
   local.set $5
   i32.const 16768
   i32.const 0
   local.get $4
   call $~lib/staticarray/StaticArray<~lib/string/String>#__uset
   i32.const 16768
   i32.const 2
   local.get $5
   call $~lib/staticarray/StaticArray<~lib/string/String>#__uset
   i32.const 16768
   i32.const 96
   call $~lib/staticarray/StaticArray<~lib/string/String>#join
   i32.const 16816
   i32.const 111
   i32.const 13
   call $~lib/builtins/abort
   unreachable
  end
  local.get $3
  i32.const 0
  i32.eq
  if
   global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
   local.set $6
   local.get $0
   i64.const 0
   call $~lib/@btc-vision/btc-runtime/runtime/storage/BaseStoredString/BaseStoredString#getPointer
   local.set $7
   i32.const 0
   i32.const 32
   call $~lib/typedarray/Uint8Array#constructor
   local.set $8
   local.get $6
   local.get $7
   local.get $8
   call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#_internalSetStorageAt
   return
  end
  local.get $3
  local.set $9
  i32.const 0
  local.set $10
  i32.const 0
  i32.const 32
  call $~lib/typedarray/Uint8Array#constructor
  local.set $11
  local.get $11
  i32.const 0
  local.get $3
  i32.const 24
  i32.shr_u
  i32.const 255
  i32.and
  call $~lib/typedarray/Uint8Array#__set
  local.get $11
  i32.const 1
  local.get $3
  i32.const 16
  i32.shr_u
  i32.const 255
  i32.and
  call $~lib/typedarray/Uint8Array#__set
  local.get $11
  i32.const 2
  local.get $3
  i32.const 8
  i32.shr_u
  i32.const 255
  i32.and
  call $~lib/typedarray/Uint8Array#__set
  local.get $11
  i32.const 3
  local.get $3
  i32.const 255
  i32.and
  call $~lib/typedarray/Uint8Array#__set
  local.get $2
  i32.const 0
  i32.const 1
  global.set $~argumentsLength
  i32.const 0
  call $~lib/typedarray/Uint8Array.wrap@varargs
  local.set $12
  local.get $9
  i32.const 28
  i32.lt_u
  if (result i32)
   local.get $9
  else
   i32.const 28
  end
  local.set $13
  i32.const 0
  local.set $14
  loop $for-loop|0
   local.get $14
   local.get $13
   i32.lt_u
   if
    local.get $11
    i32.const 4
    local.get $14
    i32.add
    local.get $12
    local.get $14
    call $~lib/typedarray/Uint8Array#__get
    call $~lib/typedarray/Uint8Array#__set
    local.get $14
    i32.const 1
    i32.add
    local.set $14
    br $for-loop|0
   end
  end
  global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
  local.set $15
  local.get $0
  i64.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/storage/BaseStoredString/BaseStoredString#getPointer
  local.set $16
  local.get $11
  local.set $17
  local.get $15
  local.get $16
  local.get $17
  call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#_internalSetStorageAt
  local.get $9
  local.get $13
  i32.sub
  local.set $9
  local.get $10
  local.get $13
  i32.add
  local.set $10
  i64.const 1
  local.set $18
  loop $while-continue|1
   local.get $9
   i32.const 0
   i32.gt_u
   if
    i32.const 0
    i32.const 32
    call $~lib/typedarray/Uint8Array#constructor
    local.set $19
    local.get $9
    i32.const 32
    i32.lt_u
    if (result i32)
     local.get $9
    else
     i32.const 32
    end
    local.set $20
    i32.const 0
    local.set $21
    loop $for-loop|2
     local.get $21
     local.get $20
     i32.lt_u
     if
      local.get $19
      local.get $21
      local.get $12
      local.get $10
      local.get $21
      i32.add
      call $~lib/typedarray/Uint8Array#__get
      call $~lib/typedarray/Uint8Array#__set
      local.get $21
      i32.const 1
      i32.add
      local.set $21
      br $for-loop|2
     end
    end
    global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
    local.set $22
    local.get $0
    local.get $18
    call $~lib/@btc-vision/btc-runtime/runtime/storage/BaseStoredString/BaseStoredString#getPointer
    local.set $23
    local.get $19
    local.set $24
    local.get $22
    local.get $23
    local.get $24
    call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#_internalSetStorageAt
    local.get $9
    local.get $20
    i32.sub
    local.set $9
    local.get $10
    local.get $20
    i32.add
    local.set $10
    local.get $18
    i64.const 1
    i64.add
    local.set $18
    br $while-continue|1
   end
  end
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/storage/BaseStoredString/BaseStoredString#set:value (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/storage/BaseStoredString/BaseStoredString#set:_value
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/storage/BaseStoredString/BaseStoredString#save
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/interfaces/OP20InitParameters/OP20InitParameters#get:symbol (param $0 i32) (result i32)
  local.get $0
  i32.load offset=12
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/interfaces/OP20InitParameters/OP20InitParameters#get:icon (param $0 i32) (result i32)
  local.get $0
  i32.load offset=16
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#instantiate (param $0 i32) (param $1 i32) (param $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  block $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#isZero|inlined.8 (result i32)
   local.get $0
   call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#get:_maxSupply
   call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredU256/StoredU256#get:value
   local.set $3
   local.get $3
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo1
   local.get $3
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:lo2
   i64.or
   local.get $3
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi1
   i64.or
   local.get $3
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#get:hi2
   i64.or
   i64.const 0
   i64.ne
   i32.eqz
   br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#isZero|inlined.8
  end
  i32.eqz
  if
   i32.const 16480
   i32.const 12368
   i32.const 179
   i32.const 46
   call $~lib/builtins/abort
   unreachable
  end
  local.get $2
  i32.eqz
  if
   local.get $0
   block $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:tx|inlined.13 (result i32)
    global.get $~lib/@btc-vision/btc-runtime/runtime/env/index/Blockchain
    local.set $4
    local.get $4
    call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:_tx
    i32.eqz
    if
     i32.const 11968
     i32.const 5536
     i32.const 145
     i32.const 13
     call $~lib/builtins/abort
     unreachable
    end
    local.get $4
    call $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:_tx
    local.tee $5
    if (result i32)
     local.get $5
    else
     i32.const 9408
     i32.const 5536
     i32.const 147
     i32.const 16
     call $~lib/builtins/abort
     unreachable
    end
    br $~lib/@btc-vision/btc-runtime/runtime/env/BlockchainEnvironment/BlockchainEnvironment#get:tx|inlined.13
   end
   call $~lib/@btc-vision/btc-runtime/runtime/env/classes/Transaction/Transaction#get:sender
   call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP_NET/OP_NET#onlyDeployer
  end
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/interfaces/OP20InitParameters/OP20InitParameters#get:decimals
  i32.const 255
  i32.and
  i32.const 32
  i32.gt_u
  if
   i32.const 16640
   i32.const 12368
   i32.const 181
   i32.const 35
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#get:_maxSupply
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/interfaces/OP20InitParameters/OP20InitParameters#get:maxSupply
  call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredU256/StoredU256#set:value
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#get:_decimals
  block $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.fromU32|inlined.4 (result i32)
   local.get $1
   call $~lib/@btc-vision/btc-runtime/runtime/contracts/interfaces/OP20InitParameters/OP20InitParameters#get:decimals
   i32.const 255
   i32.and
   local.set $6
   local.get $6
   i32.const 0
   i32.eq
   if
    block $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.get:Zero|inlined.15 (result i32)
     i32.const 0
     i64.const 0
     i64.const 0
     i64.const 0
     i64.const 0
     call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#constructor
     br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.get:Zero|inlined.15
    end
    br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.fromU32|inlined.4
   end
   local.get $6
   i32.const 1
   i32.eq
   if
    block $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.get:One|inlined.12 (result i32)
     i32.const 0
     i64.const 1
     i64.const 0
     i64.const 0
     i64.const 0
     call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#constructor
     br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.get:One|inlined.12
    end
    br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.fromU32|inlined.4
   end
   i32.const 0
   local.get $6
   i64.extend_i32_u
   i64.const 0
   i64.const 0
   i64.const 0
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#constructor
   br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.fromU32|inlined.4
  end
  call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredU256/StoredU256#set:value
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#get:_name
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/interfaces/OP20InitParameters/OP20InitParameters#get:name
  call $~lib/@btc-vision/btc-runtime/runtime/storage/BaseStoredString/BaseStoredString#set:value
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#get:_symbol
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/interfaces/OP20InitParameters/OP20InitParameters#get:symbol
  call $~lib/@btc-vision/btc-runtime/runtime/storage/BaseStoredString/BaseStoredString#set:value
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#get:_icon
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/interfaces/OP20InitParameters/OP20InitParameters#get:icon
  call $~lib/@btc-vision/btc-runtime/runtime/storage/BaseStoredString/BaseStoredString#set:value
 )
 (func $src/wrapped/husdt/HUSDT/HUSDT#onDeployment (param $0 i32) (param $1 i32)
  (local $2 i32)
  (local $3 i32)
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/buffer/BytesReader/BytesReader#readAddress
  local.set $2
  local.get $0
  local.get $2
  i32.const 13376
  call $src/wrapped/husdt/HUSDT/HUSDT#_requireValidAddress
  block $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.get:Max|inlined.2 (result i32)
   i32.const 0
   i64.const -1
   i64.const -1
   i64.const -1
   i64.const -1
   call $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256#constructor
   br $~lib/@btc-vision/as-bignum/assembly/integer/u256/u256.get:Max|inlined.2
  end
  local.set $3
  local.get $0
  i32.const 0
  local.get $3
  i32.const 6
  i32.const 16384
  i32.const 16448
  i32.const 96
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/interfaces/OP20InitParameters/OP20InitParameters#constructor
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#instantiate
  local.get $0
  local.get $2
  call $src/wrapped/husdt/HUSDT/HUSDT#_setBridgeAuthority
  local.get $0
  i32.const 0
  call $~lib/@btc-vision/btc-runtime/runtime/types/Address/Address.zero
  local.get $2
  call $src/wrapped/events/BridgeWrappedTokenEvents/BridgeAuthorityChangedEvent#constructor
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP_NET/OP_NET#emitEvent
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#isSelectorExcluded (param $0 i32) (param $1 i32) (result i32)
  local.get $1
  global.get $~lib/@btc-vision/btc-runtime/runtime/constants/Exports/BALANCE_OF_SELECTOR
  i32.eq
  if (result i32)
   i32.const 1
  else
   local.get $1
   global.get $~lib/@btc-vision/btc-runtime/runtime/constants/Exports/ALLOWANCE_SELECTOR
   i32.eq
  end
  if (result i32)
   i32.const 1
  else
   local.get $1
   global.get $~lib/@btc-vision/btc-runtime/runtime/constants/Exports/TOTAL_SUPPLY_SELECTOR
   i32.eq
  end
  if (result i32)
   i32.const 1
  else
   local.get $1
   global.get $~lib/@btc-vision/btc-runtime/runtime/constants/Exports/NAME_SELECTOR
   i32.eq
  end
  if (result i32)
   i32.const 1
  else
   local.get $1
   global.get $~lib/@btc-vision/btc-runtime/runtime/constants/Exports/SYMBOL_SELECTOR
   i32.eq
  end
  if (result i32)
   i32.const 1
  else
   local.get $1
   global.get $~lib/@btc-vision/btc-runtime/runtime/constants/Exports/DECIMALS_SELECTOR
   i32.eq
  end
  if (result i32)
   i32.const 1
  else
   local.get $1
   global.get $~lib/@btc-vision/btc-runtime/runtime/constants/Exports/NONCE_OF_SELECTOR
   i32.eq
  end
  if (result i32)
   i32.const 1
  else
   local.get $1
   global.get $~lib/@btc-vision/btc-runtime/runtime/constants/Exports/DOMAIN_SEPARATOR_SELECTOR
   i32.eq
  end
  if (result i32)
   i32.const 1
  else
   local.get $1
   global.get $~lib/@btc-vision/btc-runtime/runtime/constants/Exports/METADATA_SELECTOR
   i32.eq
  end
  if (result i32)
   i32.const 1
  else
   local.get $1
   global.get $~lib/@btc-vision/btc-runtime/runtime/constants/Exports/MAXIMUM_SUPPLY_SELECTOR
   i32.eq
  end
  if (result i32)
   i32.const 1
  else
   local.get $1
   global.get $~lib/@btc-vision/btc-runtime/runtime/constants/Exports/ICON_SELECTOR
   i32.eq
  end
  if
   i32.const 1
   return
  end
  local.get $0
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/ReentrancyGuard/ReentrancyGuard#isSelectorExcluded
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/storage/StoredString/StoredString#getClassName (param $0 i32) (result i32)
  i32.const 16976
  return
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/types/Address/Address#clone@override (param $0 i32) (result i32)
  (local $1 i32)
  block $default
   block $case0
    local.get $0
    i32.const 8
    i32.sub
    i32.load
    local.set $1
    local.get $1
    i32.const 14
    i32.eq
    br_if $case0
    br $default
   end
   local.get $0
   call $~lib/@btc-vision/btc-runtime/runtime/types/ExtendedAddress/ExtendedAddress#clone
   return
  end
  local.get $0
  call $~lib/@btc-vision/btc-runtime/runtime/types/Address/Address#clone
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP_NET/OP_NET#onExecutionStarted@override (param $0 i32) (param $1 i32) (param $2 i32)
  (local $3 i32)
  block $default
   block $case0
    local.get $0
    i32.const 8
    i32.sub
    i32.load
    local.set $3
    local.get $3
    i32.const 36
    i32.eq
    br_if $case0
    local.get $3
    i32.const 35
    i32.eq
    br_if $case0
    local.get $3
    i32.const 34
    i32.eq
    br_if $case0
    br $default
   end
   local.get $0
   local.get $1
   local.get $2
   call $~lib/@btc-vision/btc-runtime/runtime/contracts/ReentrancyGuard/ReentrancyGuard#onExecutionStarted
   return
  end
  local.get $0
  local.get $1
  local.get $2
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP_NET/OP_NET#onExecutionStarted
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/plugins/Plugin/Plugin#execute@override (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  (local $3 i32)
  local.get $0
  i32.const 8
  i32.sub
  i32.load
  drop
  local.get $0
  local.get $1
  local.get $2
  call $~lib/@btc-vision/btc-runtime/runtime/plugins/Plugin/Plugin#execute
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP_NET/OP_NET#execute@override (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  (local $3 i32)
  block $default
   block $case1
    block $case0
     local.get $0
     i32.const 8
     i32.sub
     i32.load
     local.set $3
     local.get $3
     i32.const 34
     i32.eq
     br_if $case0
     local.get $3
     i32.const 35
     i32.eq
     br_if $case1
     br $default
    end
    local.get $0
    local.get $1
    local.get $2
    call $src/wrapped/husdt/HUSDT/HUSDT#execute
    return
   end
   local.get $0
   local.get $1
   local.get $2
   call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#execute
   return
  end
  local.get $0
  local.get $1
  local.get $2
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP_NET/OP_NET#execute
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP_NET/OP_NET#onExecutionCompleted@override (param $0 i32) (param $1 i32) (param $2 i32)
  (local $3 i32)
  block $default
   block $case0
    local.get $0
    i32.const 8
    i32.sub
    i32.load
    local.set $3
    local.get $3
    i32.const 36
    i32.eq
    br_if $case0
    local.get $3
    i32.const 35
    i32.eq
    br_if $case0
    local.get $3
    i32.const 34
    i32.eq
    br_if $case0
    br $default
   end
   local.get $0
   local.get $1
   local.get $2
   call $~lib/@btc-vision/btc-runtime/runtime/contracts/ReentrancyGuard/ReentrancyGuard#onExecutionCompleted
   return
  end
  local.get $0
  local.get $1
  local.get $2
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP_NET/OP_NET#onExecutionCompleted
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/OP_NET/OP_NET#onDeployment@override (param $0 i32) (param $1 i32)
  (local $2 i32)
  block $default
   block $case0
    local.get $0
    i32.const 8
    i32.sub
    i32.load
    local.set $2
    local.get $2
    i32.const 34
    i32.eq
    br_if $case0
    br $default
   end
   local.get $0
   local.get $1
   call $src/wrapped/husdt/HUSDT/HUSDT#onDeployment
   return
  end
  local.get $0
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP_NET/OP_NET#onDeployment
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/contracts/ReentrancyGuard/ReentrancyGuard#isSelectorExcluded@override (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  block $default
   block $case0
    local.get $0
    i32.const 8
    i32.sub
    i32.load
    local.set $2
    local.get $2
    i32.const 35
    i32.eq
    br_if $case0
    local.get $2
    i32.const 34
    i32.eq
    br_if $case0
    br $default
   end
   local.get $0
   local.get $1
   call $~lib/@btc-vision/btc-runtime/runtime/contracts/OP20/OP20#isSelectorExcluded
   return
  end
  local.get $0
  local.get $1
  call $~lib/@btc-vision/btc-runtime/runtime/contracts/ReentrancyGuard/ReentrancyGuard#isSelectorExcluded
 )
 (func $~lib/@btc-vision/btc-runtime/runtime/storage/BaseStoredString/BaseStoredString#getClassName@override (param $0 i32) (result i32)
  (local $1 i32)
  block $default
   block $case0
    local.get $0
    i32.const 8
    i32.sub
    i32.load
    local.set $1
    local.get $1
    i32.const 47
    i32.eq
    br_if $case0
    br $default
   end
   local.get $0
   call $~lib/@btc-vision/btc-runtime/runtime/storage/StoredString/StoredString#getClassName
   return
  end
  unreachable
 )
 (func $"~lib/@btc-vision/btc-runtime/runtime/generic/Map/Map<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address,~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#indexOf@override" (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  local.get $0
  i32.const 8
  i32.sub
  i32.load
  drop
  local.get $0
  local.get $1
  call $"~lib/@btc-vision/btc-runtime/runtime/generic/Map/Map<~lib/@btc-vision/btc-runtime/runtime/types/Address/Address,~lib/@btc-vision/btc-runtime/runtime/memory/Nested/Nested<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256>>#indexOf"
 )
 (func $~instanceof|~lib/@btc-vision/btc-runtime/runtime/memory/MapOfMap/MapOfMap<~lib/@btc-vision/as-bignum/assembly/integer/u256/u256> (param $0 i32) (result i32)
  (local $1 i32)
  block $is_instance
   local.get $0
   i32.const 8
   i32.sub
   i32.load
   local.set $1
   local.get $1
   i32.const 40
   i32.eq
   br_if $is_instance
   i32.const 0
   return
  end
  i32.const 1
 )
 (func $~start
  call $start:src/wrapped/husdt/index
 )
)
