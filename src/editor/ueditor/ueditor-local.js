
module.exports = function(app) {

  // "connect-multiparty": "2.0.0",
  var multipart = require('connect-multiparty');
  var multipartMiddleware = multipart();

  // Images' temp dirctory. (Example: C:\Users\zhou\AppData\Local\Temp\)
  var dir;

  // Image request.
  app.all('/ueditor/img/:id', function(req, res) {
    res.sendFile(dir + '/' + req.params.id);
  });

  // Ueditor server.
  app.all('/ueditor/ue', multipartMiddleware, function(req, res) {

    // Upload
    if (req.query.action === "uploadimage") {

      var path = req.files.upfile.path,
          name = path.substring(path.lastIndexOf('\\') + 1);

      if (dir === undefined) {
        dir = path.substring(0, path.lastIndexOf('\\'));
      }

      res.json({
        'url': '/ueditor/img/' + name,
        'title': '',
        'original': '',
        'state': 'SUCCESS'
      });

    // List
    } else if (req.query.action === "listimage") {
      res.json({
        "state": "SUCCESS",
        "list": [],
        "start": 1,
        "total": 1
      })

    // Config
    } else {
      res.redirect('/ueditor/php/config.json')
    }
  })

}
