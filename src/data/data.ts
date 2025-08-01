import {AnimationObject} from 'lottie-react-native';


export interface OnboardingData {
  id: number;
  animation: AnimationObject;
  text: string;
  textColor: string;
  backgroundColor: string;
  description: string
}

const data: OnboardingData[] = [
  {
    id: 1,
    animation: require('../assets/animations/Lottie1.json'),
    text: 'Your Journey to Wellness Starts Here',
    textColor: '#1e1e1e',
    backgroundColor: '#fff',
    description: "Transform your health with personalized nutrition and fitness guidance",
  },
  {
    id: 2,
    animation: require('../assets/animations/Lottie2.json'),
    text: 'Track Every Bite',
    textColor: '#fff',
    backgroundColor: '#1e1e1e',
    description: "Stay in control with effortless food logging, calorie counting, and macro tracking.",
    
  },
  {
    id: 3,
    animation: require('../assets/animations/Lottie3.json'),
    text: 'Healthy Habits, Long Term Results',
    textColor: '#1e1e1e',
    backgroundColor: '#fff',
    description: "Build sustainable eating habits with daily tips, reminders, and progress insights.",
  },
];

export default data;
