(function(){
  document.addEventListener('invalid', function(e) {
    e.target.style.border = 'solid #f00';

    if (e._fromType !== 'input')
      alert(e._invalidationMessage);
  })

  document.addEventListener('valid', function(e) {
    e.target.style.border = 'solid #0f0';
  })
}());
