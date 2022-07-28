/*
import React, { FC, ReactNode } from "react";

interface LifeCycleHooks {
  onMount: () => void;
}

export function withLifeCycle<Props>(component: FC<Props>) {
  (hooks: LifeCycleHooks) => {
    return <LifecycleComponent></LifecycleComponent>;
  };
}

class LifecycleComponent extends React.Component<
  { children: ReactNode; component: FC; lifeCycleHooks: LifeCycleHooks },
  {}
> {
  componentDidMount() {
    this.props.lifeCycleHooks.onMount;
  }

  render() {
    return <this.props.component>{this.props.children}</this.props.component>;
  }
}
*/
