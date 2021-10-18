import { Command, Scene, SceneEnter, SceneLeave } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/typings/scenes';

export const SCENE_WELCOME='SCENE_WELCOME';

// TODO
@Scene(SCENE_WELCOME)
export class RandomNumberSceneExample {
  @SceneEnter()
  onSceneEnter(): string {
    console.log('Enter to scene');
    return 'Welcome on scene ✋';
  }

  @SceneLeave()
  onSceneLeave(): string {
    console.log('Leave from scene');
    return 'Bye Bye 👋';
  }

  @Command(['rng', 'random'] as any)
  onRandomCommand(): number {
    console.log('Use "random" command');
    return Math.floor(Math.random() * 11);
  }

  @Command(['leave'] as any)
  async onLeaveCommand(ctx: SceneContext): Promise<void> {
    await ctx.scene.leave();
  }
}
