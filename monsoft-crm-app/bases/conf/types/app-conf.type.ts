import { MergeUnion } from '../../types';

type ModuleConfName<ModulesConf> = keyof ModulesConf;

type ModuleConfUnion<ModulesConf> = ModulesConf[ModuleConfName<ModulesConf>];

export type Conf<ModulesConf> = MergeUnion<ModuleConfUnion<ModulesConf>>;
