onReady(function(run) {
  console.log('ready go!!!');
  run();
});

onProgress(function(percent, resource) {
  console.log('loading...', percent * 100 + '%');
});

onError(function(error) {
  console.error(error);
});

onDone(function() {
  console.log('welcome!!!');
});
