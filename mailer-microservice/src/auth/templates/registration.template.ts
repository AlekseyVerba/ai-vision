export const registrationTemplate = ({
  name,
  token,
}: {
  name: string;
  token: string;
}) => {
  return `
        <div>
            <h3>Thank you ${name}, for registration on AI-VISION</h3>
            <a href="${process.env.FRONT_URL || 'http://localhost:3000'}/sign-up/${token}">link<a/>
        </div>
    `;
};
