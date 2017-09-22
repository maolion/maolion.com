onReady(function() {
  console.log('ready go!!!');
});

onProgress(function(percent, resourceUrl) {
  console.log('loading...', percent * 100 + '%');
});

onError(function(error) {
  console.error(error);
});

onDone(function() {
  console.log('welcome!!!');
});

