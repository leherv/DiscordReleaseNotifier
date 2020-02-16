import Command from './command';
import sungjinwoo from './sung-jin-woo';
import viktor from './viktor';
import baek from './baek';
import chahaein from './cha-hae-in';
import help from './help';
import setupServer from './setup-server';
import roleme from './role-me';

const commands: Map<string, Command> = new Map<string, Command>();
commands.set(sungjinwoo.name, sungjinwoo);
commands.set(viktor.name, viktor);
commands.set(baek.name, baek);
commands.set(chahaein.name, chahaein);
commands.set(setupServer.name, setupServer);
commands.set(roleme.name, roleme);
commands.set(help.name, help);


export default commands;