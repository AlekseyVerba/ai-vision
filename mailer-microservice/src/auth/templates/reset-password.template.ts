export const resetPasswordTemplate = ({
  name,
  token,
}: {
  name: string;
  token: string;
}) => {
  return `
        <div>
            <h3>Dear ${name},</h3><br>
            <a href="${process.env.FRONT_URL || 'http://localhost:3000'}/reset-password/${token}">link<a/>
        </div>
    `;
};
