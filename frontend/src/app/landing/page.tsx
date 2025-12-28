import { Metadata } from 'next';
import LandingView from './LandingView';

export const metadata: Metadata = {
  title: 'Welcome to DubAI',
  description: 'The ultimate guide to UW campus life.',
};

export default function LandingPage() {
  return <LandingView />;
}
