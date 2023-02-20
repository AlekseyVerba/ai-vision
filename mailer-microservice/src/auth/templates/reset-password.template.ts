export const resetPasswordTemplate = ({ name, token }: { name: string; token: string }) => {
    return `
        <div>
            <h3>Dear ${name},</h3><br>
            <p>Your token for reset password - ${token}</p>
        </div>
    `
}