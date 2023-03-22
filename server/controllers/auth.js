const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4 } = require("uuid");
const QRCode = require("qrcode");
const speakeasy = require("speakeasy");
const tempSecretsStore = {};

const jwtExpiration = 60 * 60 * 24 * 30; // 24 hours

const register = async (req, res) => {
  try {
    const { email, password, token, tempUuid } = req.body;

    const alreadyRegisteredUser = await db.users.findOne({
      where: {
        email,
      },
    });

    if (alreadyRegisteredUser) {
      res.status(400).send({
        message: "Email already registered",
      });
      return;
    }

    const userSecret = tempSecretsStore[tempUuid];

    const verified = speakeasy.totp.verify({
      secret: userSecret,
      token,
      encoding: "base32",
    });

    if (!verified) {
      res.status(400).send({
        message: "Invalid Token",
      });
      return;
    }

    await db.users.create({
      email: req.body.email,
      password: bcrypt.hashSync(password, 8),
      auth_secret: userSecret,
    });

    var jwtToken = jwt.sign({ email }, process.env.AUTH_SECRET, {
      expiresIn: jwtExpiration,
    });

    // res.cookie("token", jwtToken, { httpOnly: true });

    res.status(201).send({
      token: jwtToken,
      email,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).send({
      message: "Something went wrong, please try again later",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password, token } = req.body;

    const user = await db.users.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      res.status(404).send({ message: "Invalid Credentials" });
      return;
    }

    var passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) {
      res.status(401).send({
        message: "Invalid Credentials",
      });
      return;
    }

    const verified = speakeasy.totp.verify({
      secret: user.auth_secret,
      token,
      encoding: "base32",
    });

    if (!verified) {
      res.status(400).send({
        message: "Invalid Token",
      });
      return;
    }

    var jwtToken = jwt.sign({ email }, process.env.AUTH_SECRET, {
      expiresIn: jwtExpiration,
    });

    res.status(200).send({
      token: jwtToken,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const requestQrCode = (req, res) => {
  try {
    const { base32, otpauth_url } = speakeasy.generateSecret({
      name: "Team Rosters Assignment",
    });

    const temp_uuid = v4();

    tempSecretsStore[temp_uuid] = base32;

    QRCode.toDataURL(otpauth_url, (err, url) => {
      if (err) {
        throw new Error(err);
      }

      res.send({
        temp_uuid,
        url,
      });
    });
  } catch (error) {
    res.status(500).send({
      message: "Something went wrong, please try again later",
    });
  }
};

module.exports = {
  register,
  login,
  requestQrCode,
};
