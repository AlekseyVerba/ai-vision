export const registrationTemplate = ({ name, token }: { name: string; token: string }) => {
    return `
        <div>
            <h3>Thank you ${name}, for registration on AI-VISION</h3>
            <a href="http://localhost:3000/auth/sign-up/${token}">link<a/>
        </div>
    `
}