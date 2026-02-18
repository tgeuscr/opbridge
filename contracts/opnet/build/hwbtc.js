async function instantiate(module, imports = {}) {
  const adaptedImports = {
    env: Object.setPrototypeOf({
      exit(status, data, dataLength) {
        // ~lib/@btc-vision/btc-runtime/runtime/env/global/env_exit(u32, ~lib/arraybuffer/ArrayBuffer, u32) => void
        status = status >>> 0;
        data = __liftBuffer(data >>> 0);
        dataLength = dataLength >>> 0;
        exit(status, data, dataLength);
      },
      environment(offset, length, result) {
        // ~lib/@btc-vision/btc-runtime/runtime/env/global/getEnvironmentVariables(u32, u32, ~lib/arraybuffer/ArrayBuffer) => void
        offset = offset >>> 0;
        length = length >>> 0;
        result = __liftBuffer(result >>> 0);
        environment(offset, length, result);
      },
      calldata(offset, length, result) {
        // ~lib/@btc-vision/btc-runtime/runtime/env/global/getCalldata(u32, u32, ~lib/arraybuffer/ArrayBuffer) => void
        offset = offset >>> 0;
        length = length >>> 0;
        result = __liftBuffer(result >>> 0);
        calldata(offset, length, result);
      },
      sha256(data, dataLength, result) {
        // ~lib/@btc-vision/btc-runtime/runtime/env/global/_sha256(~lib/arraybuffer/ArrayBuffer, u32, ~lib/arraybuffer/ArrayBuffer) => void
        data = __liftBuffer(data >>> 0);
        dataLength = dataLength >>> 0;
        result = __liftBuffer(result >>> 0);
        sha256(data, dataLength, result);
      },
      load(key, result) {
        // ~lib/@btc-vision/btc-runtime/runtime/env/global/loadPointer(~lib/arraybuffer/ArrayBuffer, ~lib/arraybuffer/ArrayBuffer) => void
        key = __liftBuffer(key >>> 0);
        result = __liftBuffer(result >>> 0);
        load(key, result);
      },
      store(key, value) {
        // ~lib/@btc-vision/btc-runtime/runtime/env/global/storePointer(~lib/arraybuffer/ArrayBuffer, ~lib/arraybuffer/ArrayBuffer) => void
        key = __liftBuffer(key >>> 0);
        value = __liftBuffer(value >>> 0);
        store(key, value);
      },
      emit(data, dataLength) {
        // ~lib/@btc-vision/btc-runtime/runtime/env/global/emit(~lib/arraybuffer/ArrayBuffer, u32) => void
        data = __liftBuffer(data >>> 0);
        dataLength = dataLength >>> 0;
        emit(data, dataLength);
      },
      accountType(address) {
        // ~lib/@btc-vision/btc-runtime/runtime/env/global/getAccountType(~lib/arraybuffer/ArrayBuffer) => u32
        address = __liftBuffer(address >>> 0);
        return accountType(address);
      },
      call(address, calldata, calldataLength, resultLength) {
        // ~lib/@btc-vision/btc-runtime/runtime/env/global/callContract(~lib/arraybuffer/ArrayBuffer, ~lib/arraybuffer/ArrayBuffer, u32, ~lib/arraybuffer/ArrayBuffer) => u32
        address = __liftBuffer(address >>> 0);
        calldata = __liftBuffer(calldata >>> 0);
        calldataLength = calldataLength >>> 0;
        resultLength = __liftBuffer(resultLength >>> 0);
        return call(address, calldata, calldataLength, resultLength);
      },
      callResult(offset, length, result) {
        // ~lib/@btc-vision/btc-runtime/runtime/env/global/getCallResult(u32, u32, ~lib/arraybuffer/ArrayBuffer) => void
        offset = offset >>> 0;
        length = length >>> 0;
        result = __liftBuffer(result >>> 0);
        callResult(offset, length, result);
      },
      verifySignature(publicKey, signature, message) {
        // ~lib/@btc-vision/btc-runtime/runtime/env/global/verifySignature(~lib/arraybuffer/ArrayBuffer, ~lib/arraybuffer/ArrayBuffer, ~lib/arraybuffer/ArrayBuffer) => u32
        publicKey = __liftBuffer(publicKey >>> 0);
        signature = __liftBuffer(signature >>> 0);
        message = __liftBuffer(message >>> 0);
        return verifySignature(publicKey, signature, message);
      },
      loadMLDSA(key, result) {
        // ~lib/@btc-vision/btc-runtime/runtime/env/global/loadMLDSA(~lib/arraybuffer/ArrayBuffer, ~lib/arraybuffer/ArrayBuffer) => void
        key = __liftBuffer(key >>> 0);
        result = __liftBuffer(result >>> 0);
        loadMLDSA(key, result);
      },
    }, Object.assign(Object.create(globalThis), imports.env || {})),
  };
  const { exports } = await WebAssembly.instantiate(module, adaptedImports);
  const memory = exports.memory || imports.env.memory;
  const adaptedExports = Object.setPrototypeOf({
    abort(message, fileName, line, column) {
      // src/wrapped/hwbtc/index/abort(~lib/string/String, ~lib/string/String, u32, u32) => void
      message = __retain(__lowerString(message) || __notnull());
      fileName = __lowerString(fileName) || __notnull();
      try {
        exports.abort(message, fileName, line, column);
      } finally {
        __release(message);
      }
    },
    execute(calldataLength) {
      // ~lib/@btc-vision/btc-runtime/runtime/exports/index/execute(u32) => u32
      return exports.execute(calldataLength) >>> 0;
    },
    onDeploy(calldataLength) {
      // ~lib/@btc-vision/btc-runtime/runtime/exports/index/onDeploy(u32) => u32
      return exports.onDeploy(calldataLength) >>> 0;
    },
    onUpdate(calldataLength) {
      // ~lib/@btc-vision/btc-runtime/runtime/exports/index/onUpdate(u32) => u32
      return exports.onUpdate(calldataLength) >>> 0;
    },
  }, exports);
  function __liftBuffer(pointer) {
    if (!pointer) return null;
    return memory.buffer.slice(pointer, pointer + new Uint32Array(memory.buffer)[pointer - 4 >>> 2]);
  }
  function __lowerString(value) {
    if (value == null) return 0;
    const
      length = value.length,
      pointer = exports.__new(length << 1, 2) >>> 0,
      memoryU16 = new Uint16Array(memory.buffer);
    for (let i = 0; i < length; ++i) memoryU16[(pointer >>> 1) + i] = value.charCodeAt(i);
    return pointer;
  }
  const refcounts = new Map();
  function __retain(pointer) {
    if (pointer) {
      const refcount = refcounts.get(pointer);
      if (refcount) refcounts.set(pointer, refcount + 1);
      else refcounts.set(exports.__pin(pointer), 1);
    }
    return pointer;
  }
  function __release(pointer) {
    if (pointer) {
      const refcount = refcounts.get(pointer);
      if (refcount === 1) exports.__unpin(pointer), refcounts.delete(pointer);
      else if (refcount) refcounts.set(pointer, refcount - 1);
      else throw Error(`invalid refcount '${refcount}' for reference '${pointer}'`);
    }
  }
  function __notnull() {
    throw TypeError("value must not be null");
  }
  return adaptedExports;
}
export const {
  memory,
  __new,
  __pin,
  __unpin,
  __collect,
  __rtti_base,
  abort,
  execute,
  onDeploy,
  onUpdate,
} = await (async url => instantiate(
  await (async () => {
    const isNodeOrBun = typeof process != "undefined" && process.versions != null && (process.versions.node != null || process.versions.bun != null);
    if (isNodeOrBun) { return globalThis.WebAssembly.compile(await (await import("node:fs/promises")).readFile(url)); }
    else { return await globalThis.WebAssembly.compileStreaming(globalThis.fetch(url)); }
  })(), {
  }
))(new URL("hwbtc.wasm", import.meta.url));
