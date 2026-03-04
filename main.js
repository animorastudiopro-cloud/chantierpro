document.getElementById("whatsappForm").addEventListener("submit", function(e) {
    e.preventDefault();

    let nom = document.getElementById("nom").value;
    let telephone = document.getElementById("telephone").value;
    let ville = document.getElementById("ville").value;
    let typeProjet = document.getElementById("typeProjet").value;
    let message = document.getElementById("message").value;

    let texte = `Bonjour ChantierPro,%0A%0A` +
        `Nom: ${nom}%0A` +
        `Téléphone: ${telephone}%0A` +
        `Ville: ${ville}%0A` +
        `Type de projet: ${typeProjet}%0A` +
        `Message: ${message}`;

    window.open(`https://wa.me/2250160749786?text=${texte}`, "_blank");
});