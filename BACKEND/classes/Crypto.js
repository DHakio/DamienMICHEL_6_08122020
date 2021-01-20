const crypto = require('crypto');

class Crypto {
    password = "KeepMyInformationsSaferPleasePlz";
    algorithm = "aes-256-cbc";
    encryption_iv = "16BitsEncryption"

    encrypt(text) {
        let cipher = crypto.createCipheriv(this.algorithm, this.password, this.encryption_iv);
        let encrypted = cipher.update(text);

        encrypted = Buffer.concat([encrypted, cipher.final()]);

        return encrypted.toString('hex');
    }

    decrypt(text) {
        let textParts = text.split(':');
        let iv = Buffer.from(textParts.shift(), 'hex');
        let encryptedText = Buffer.from(textParts.join(':'), 'hex');
        let decipher = crypto.createCipheriv(this.algorithm, Buffer.from(this.password), iv);
        let decrypted = decipher.update(encryptedText);

        decrypted = Buffer.concat([decrypted, decipher.final()]);

        return decrypted.toString();
    }
}
module.exports = Crypto;