import { Component, type ReactNode } from "react";

import { StaticStudio } from "./StaticStudio";

export class QuietBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError(): { failed: boolean } {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return <StaticStudio />;
    }
    return this.props.children;
  }
}
