function sendBoth(e) {
    e.preventDefault();
    var form = e.target;
    var btn = form.querySelector('button[type="submit"]');
    var honeyField = form.querySelector('[name="_honey"]');
    if (honeyField && honeyField.value) return false;
    btn.textContent = 'Envoi en cours...';
    btn.disabled = true;
    var nom = (form.querySelector('[name="nom"]') || {}).value || '';
    var tel = (form.querySelector('[name="tel"]') || {}).value || '';
    var email = (form.querySelector('[name="email"]') || {}).value || '';
    var services = (form.querySelector('[name="services"]') || {}).value || '';
    var commentaires = (form.querySelector('[name="commentaires"]') || {}).value || '';
    var webhookData = new FormData();
    webhookData.append('name', nom);
    webhookData.append('email', email);
    webhookData.append('tel', tel);
    webhookData.append('service', services);
    webhookData.append('message', 'Telephone : ' + tel + '\nService demande : ' + services + '\n\n' + commentaires);
    var p1 = fetch('https://webprime.app/webhook/contact/857f6a6d191ea9ed8f4d7159245a653f3043557bd87b70e04ebc34dea33a261a', {
        method: 'POST',
        body: webhookData,
        keepalive: true
    }).catch(function() {});
    var p2 = fetch('https://formsubmit.co/ajax/contact@assainissement-94.com', {
        method: 'POST',
        body: new FormData(form),
        keepalive: true,
        headers: { 'Accept': 'application/json' }
    }).catch(function() {});
    var shown = false;
    var showThanks = function() {
        if (shown) return;
        shown = true;
        form.style.display = 'none';
        var thanks = form.nextElementSibling;
        while (thanks && !(thanks.classList && thanks.classList.contains('contact-thanks'))) {
            thanks = thanks.nextElementSibling;
        }
        if (thanks) thanks.style.display = 'block';
    };
    Promise.allSettled([p1, p2]).then(showThanks);
    setTimeout(showThanks, 3000);
    return false;
}
