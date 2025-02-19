export default class ModalContentProvider {
  constructor() {
    this.modalContents = {
      aboutMe: {
        id: 0,
        title: "3D Web Developer",
        description: "I specialize in modern web development using React.js and 3D models integration with Three.js, crafting dynamic and interactive user experiences with animated websites. <br/><br/> With expertise in front-end development and 3D model customization, I deliver scalable and optimized solutions.<br/> <br/> Passionate about problem-solving and innovation, I adapt quickly to new technologies to create impactful applications.",
    },    
      portfolio: {
        id: 1,
        title: 'Portfolio',
        description: {
          text: 'Fizzi Fruit Juice',
          videoUrl: '/assets/fizzi.mp4', // Add your video link here
          link: 'https://fizzi-portfoliowebsitebymuhammadfaizan.vercel.app/'
        },
      },
      social: {
        id: 2,
        title: 'Contact',
        description: [
          { name: 'Facebook', url: 'https://www.facebook.com/mohamad.faizan.520' },
          { name: 'Instagram', url: 'https://www.instagram.com/faizansiddiqui.19/' },
          { name: 'GitHub', url: 'https://github.com/MuhammadFaizanIbrahim' },
          { name: 'LinkedIn', url: 'https://linkedin.com/in/mern-developer-muhammad-faizan-ibrahim' }
        ]
      }
    };
  }

  getModalInfo(portalName) {
    return this.modalContents[portalName];
  }
}
