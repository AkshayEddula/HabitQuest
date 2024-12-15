import onboarding1 from "../assets/images/onboarding1.png";
import onboarding2 from "../assets/images/onboarding2.png";
import onboarding3 from "../assets/images/onboarding3.png";
import signupImg from "../assets/images/ui/signup.png";
import signinImg from "../assets/images/ui/signin.png";
import glowEffect from '../assets/images/ui/gloweffect.png';
import levelBall from '../assets/images/ui/level.png';
import coinImg from '../assets/images/ui/coin.png';


export const images = {
    onboarding1,
    onboarding2,
    onboarding3,
    signupImg,
    signinImg,
    glowEffect,
    coinImg,
    levelBall,
};

export const onboarding = [
    {
      id: 1,
      title: "Set Your Habits and Goals",
      description:
        "Choose the habits you want to build, from fitness to mindfulness, and set personalized goals to fit your lifestyle",
      image: images.onboarding1,
    },
    {
      id: 2,
      title: "Track Your Progress Daily",
      description:
        "View your progress with clear, intuitive charts to keep you motivated and see how far you've come.",
      image: images.onboarding2,
    },

    {
      id: 3,
      title: "Celebrate Milestones and Stay Motivated",
      description:
        "Earn rewards, hit streaks, and celebrate every step toward a better you with reminders and encouragement",
      image: images.onboarding3,
    },
  ];
