import jwt from 'jsonwebtoken'

function createToken(userId) {
    const token = jwt.sign(
        {
            id: userId,
        },
        process.env.SECRET_KEY
    )
    return token
}

export { createToken }
