
        module.exports = {
        apps: [
          {
            name: 'hello',
            script: '/root/ai-vision-2/releases/20230224125308/hello.js',
            watch: true,
            autorestart: true,
            restart_delay: 1000,
            env: {
              NODE_ENV: 'development'
            },
            env_production: {
              NODE_ENV: 'production'
            }
          }
        ]
        };