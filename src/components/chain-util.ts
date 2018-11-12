import { ec as EC } from "elliptic";
import * as uuidV1 from "uuid/v1";
import * as SHA256 from "crypto-js/sha256";

const ec = new EC("secp256k1");

class ChainUtil {
  static genKeyPair() {
    return ec.genKeyPair();
  }

  static id() {
    return uuidV1();
  }

  static hash(data) {
    return SHA256(JSON.stringify(data)).toString();
  }
}

export default ChainUtil;
