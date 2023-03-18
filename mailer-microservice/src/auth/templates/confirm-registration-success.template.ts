export const confirmRegistrationSuccessTemplate = ({
  name,
}: {
  name: string;
}) => {
  return `
        <div>
            <h3>Dear ${name},</h3><br>
            <p>Your account successfully confirmed</p>
        </div>
    `;
};
