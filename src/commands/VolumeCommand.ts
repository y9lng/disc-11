import BaseCommand from "../structures/BaseCommand";
import { ICommandComponent, IMessage } from "../../typings";
import Disc_11 from "../structures/Disc_11";
import { DefineCommand } from "../utils/decorators/DefineCommand";
import { isUserInTheVoiceChannel, isMusicPlaying, isSameVoiceChannel } from "../utils/decorators/MusicHelper";
import { createEmbed } from "../utils/createEmbed";

@DefineCommand({
    aliases: ["vol", "v"],
    name: "volume",
    description: "Show or set the track volume",
    usage: "{prefix}volume [new volume]"
})
export default class VolumeCommand extends BaseCommand {
    public constructor(public client: Disc_11, public meta: ICommandComponent["meta"]) { super(client, meta); }

    @isUserInTheVoiceChannel()
    @isMusicPlaying()
    @isSameVoiceChannel()
    public execute(message: IMessage, args: string[]): any {
        let volume = Number(args[0]);

        if (isNaN(volume)) return message.channel.send(createEmbed("info", `🔊  **|**  The current volume is **\`${message.guild!.queue!.volume.toString()}\`**`));

        if (volume < 0) volume = 0;
        if (volume === 0) return message.channel.send(createEmbed("warn", "Please pause the music instead of setting the volume to **\`0\`**"));
        if (Number(args[0]) > this.client.config.maxVolume) {
            return message.channel.send(
                createEmbed("warn", `I can't set the volume above **\`${this.client.config.maxVolume}\`**`)
            );
        }

        message.guild!.queue!.volume = Number(args[0]);
        message.guild!.queue!.connection?.dispatcher.setVolume(Number(args[0]) / this.client.config.maxVolume);
        message.channel.send(createEmbed("info", `🔊  **|**  Volume set to **\`${args[0]}\`**`)).catch(console.error);
    }
}
