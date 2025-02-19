export default class ModalManager {
  constructor() {
    this.modal = document.getElementById("myModal");
    this.close = document.getElementsByClassName("close")[0];
    this.close.onclick = () => {
      this.closeModal();
    };
  }

  openModal(title, description, objId) {
    document.getElementById("modalTitle").innerHTML = title;

    switch (objId) {
      case 0:
        document.getElementById(
          "modalDescription"
          ).innerHTML = `<p style="font-family: 'Poppins', serif; font-weight: 400; font-size: 17px; line-height: 1.6;">${description}</p>`;
          this.modal.style.width = "80%";
        break;

      case 1:
        if (description.videoUrl) {
          document.getElementById("modalDescription").innerHTML = `
            <video width="100%" autoplay>
              <source src="${description.videoUrl}" type="video/mp4">
              Your browser does not support the video tag.
            </video>
            ${description.link ? `<a href="${description.link}" target="_blank" class="link">Visit Website</a>` : ""}
          `;
        
          this.modal.style.width = "100%";
          document.querySelector(".link").style.display = "inline-block";
        }
        break;

      case 2:
        const listHtml = description
          .map(
            (link) => `
          <li class="${link.name.toLowerCase()}">
            <a href="${link.url}" target="_blank">
              <i class="fab fa-${link.name.toLowerCase()}"></i> ${link.name}
            </a>
          </li>`
          )
          .join("");
        document.getElementById("modalDescription").innerHTML = `
        <ul class="social-links" style="font-family: 'Poppins', sans-serif;">
          ${listHtml}
          <li>📞 Phone: +92 311 0369393</li>
          <li>📧 Email:  mfaizanibrahim26@gmail.com</li>
        </ul>
      `;
        this.modal.style.width = "70%";        
        break;
    }

    this.modal.style.display = "block";
    this.modal.classList.remove("fadeOut");
    this.modal.classList.add("fadeIn");
  }

  closeModal() {
    this.modal.classList.remove("fadeIn");
    this.modal.classList.add("fadeOut");
    setTimeout(() => {
      this.modal.style.display = "none";
    }, 600);
  }
}
