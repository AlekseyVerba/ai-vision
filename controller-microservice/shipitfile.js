
module.exports = shipit => {
    require('shipit-deploy')(shipit);
    require('shipit-shared')(shipit);
  
    const appName = 'hello';
  
    
    shipit.initConfig({
      default: {
        deployTo: '/root/ai-vision-2',
        repositoryUrl: 'https://github.com/AlekseyVerba/ai-vision.git',
        keepReleases: 5,
        key: '/home/verba/.ssh/',
        shared: {
          overwrite: true,
          dirs: ['node_modules']
        },
        default: {
          timeout: (60000 * 20)
        }
      },
      production: {
        servers: 'root@188.225.77.3'
      }
    });
  
    const path = require('path');
    const ecosystemFilePath = path.join(
      shipit.config.deployTo,
      'shared',
      'ecosystem.config.js'
    );
  
    // Our listeners and tasks will go here

    shipit.on('deploy', () => {
        shipit.start('say-hello');
      });
      
      shipit.blTask('say-hello', async () => {
        shipit.local('echo "hello from your local computer"')
      });

      shipit.on('updated', () => {
        shipit.start('npm-install', 'copy-config');
      });
    
      shipit.on('published', () => {
        shipit.start('build')
        // shipit.start('pm2-server');
      });


      shipit.blTask('copy-config', async () => {

        // const fs = require('fs');
        
        // const ecosystem = `
        // module.exports = {
        // apps: [
        //   {
        //     name: '${appName}',
        //     script: '${shipit.releasePath}/hello.js',
        //     watch: true,
        //     autorestart: true,
        //     restart_delay: 1000,
        //     env: {
        //       NODE_ENV: 'development'
        //     },
        //     env_production: {
        //       NODE_ENV: 'production'
        //     }
        //   }
        // ]
        // };`;
        
        //   fs.writeFileSync('ecosystem.config.js', ecosystem, function(err) {
        //     if (err) throw err;
        //     console.log('File created successfully.');
        //   });
        
        //   await shipit.copyToRemote('ecosystem.config.js', ecosystemFilePath);
        });


        shipit.blTask('npm-install', async () => {
            await shipit.remote(`cd ${shipit.releasePath}/controller-microservice && npm install`,{
              timeout: (60000 * 20)
            }),
            await shipit.remote(`cd ${shipit.releasePath}/mailer-microservice && npm install`),
            await shipit.remote(`cd ${shipit.releasePath}/database-microservice && npm install`)
          });
  
          
          shipit.blTask('build', async () => {
            await shipit.remote(`cd ${shipit.releasePath}/database-microservice && npm run build`),
            await shipit.remote(`cd ${shipit.releasePath}/controller-microservice && npm run build`),
            await shipit.remote(`cd ${shipit.releasePath}/mailer-microservice && npm run build`)

            shipit.start('pm2-server');
          });
          

          shipit.blTask('pm2-server', async () => {
            await shipit.remote(`pm2 delete database3 -s  || :`);
            await shipit.remote(`pm2 delete controller3 -s  || :`);
            await shipit.remote(`pm2 delete mailer3 -s  || :`);

            await shipit.remote(
                `pm2 start ${shipit.releasePath}/database-microservice/dist/main.js --name database3`
              );
              await shipit.remote(
                `pm2 start ${shipit.releasePath}/controller-microservice/dist/main.js --name controller3`
              );
              await shipit.remote(
                `pm2 start ${shipit.releasePath}/mailer-microservice/dist/main.js --name mailer3`
              );
          });
  };
  
