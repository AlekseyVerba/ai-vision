export const resetPasswordTemplate = ({ name, token }: { name: string; token: string }) => {
    return `
        <div>
            <h3>Dear ${name},</h3><br>
            <a href="http://localhost:3000/auth/reset-password/${token}">link<a/>
        </div>
    `
}