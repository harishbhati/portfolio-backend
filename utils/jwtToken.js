import jwt from "jsonwebtoken";

const generateToken = (user, message, statusCode, res) => {
  if (!user || !user._id) {
    throw new Error("Failed to generate JWT token");
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "7d",
  });

  res
    .status(statusCode)
    .cookie("token", token, {
      expires: new Date(Date.now() + process.env.COOKIES_EXPIRES * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })
    .json({
      success: true,
      message,
      token,
      user,
    });
};

export default generateToken;
