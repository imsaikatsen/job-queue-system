async function bootstrap() {
  console.log('Worker started...');

  // Later:
  // connect DB
  // poll jobs table
  // process jobs

  setInterval(() => {
    console.log('Checking for jobs...');
  }, 5000);
}

bootstrap();