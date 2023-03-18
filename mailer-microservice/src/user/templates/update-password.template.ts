export const updatePasswordTemplate = (name: string) => {
  return `
        <div>
            <h3>Dear ${name}, your password was 
            successfully changed!</h3>
        </div>
    `;
};
