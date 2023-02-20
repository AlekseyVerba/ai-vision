export const registrationTemplate = ({ name, token }: { name: string; token: string }) => {
    return `
        <div>
            <h3>Thank you ${name}, for registration on AI-VISION</h3>
            <p>Your token - ${token}</p>
        </div>
    `
}