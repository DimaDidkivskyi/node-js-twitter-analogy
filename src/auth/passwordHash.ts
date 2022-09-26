import Crypto from "crypto";

export const passwordHash = (password: string) => {
    const sha = Crypto.createHash("sha512").update(String(password));
    return sha.digest("hex");
};
