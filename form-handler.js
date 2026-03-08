function sendBoth(e) {
    e.preventDefault();
    var form = document.getElementById('contactForm');
    var btn = form.querySelector('button[type="submit"]');
    var honeyField = form.querySelector('[name="_honey"]');
    if (honeyField && honeyField.value) return false;
    btn.textContent = 'Envoi en cours...';
    btn.disabled = true;
    var formData = new FormData(form);
    fetch('https://webprime.app/webhook/contact/857f6a6d191ea9ed8f4d7159245a653f3043557bd87b70e04ebc34dea33a261a', {
        method: 'POST',
        body: formData
    }).catch(function() {});
    form.submit();
    return false;
}
