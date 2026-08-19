import { Component, type ReactNode } from 'react';

interface SplineErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

interface SplineErrorBoundaryState {
  hasError: boolean;
}

export class SplineErrorBoundary extends Component<
  SplineErrorBoundaryProps,
  SplineErrorBoundaryState
> {
  state: SplineErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
