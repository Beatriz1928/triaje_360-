import { environment } from 'src/environments/environment';
import { UserRole } from '../shared/auth.roles';
const adminRoot = environment.adminRoot;

export interface IMenuItem {
  id?: string;
  icon?: string;
  label: string;
  to: string;
  newWindow?: boolean;
  subs?: IMenuItem[];
  roles?: UserRole[];
}

const data: IMenuItem[] = [
  {
    icon: 'iconsminds-student-hat',
    label: 'menu.schoolYears',
    to: `${adminRoot}/school-years/data-list`,
    roles: [UserRole.Admin],
  },
  {
    icon: 'iconsminds-notepad',
    label: 'menu.subjects',
    to: `${adminRoot}/subjects/data-list`,
    roles: [UserRole.Admin, UserRole.Teacher, UserRole.Student],
  },
  {
    icon: 'iconsminds-conference',
    label: 'menu.users',
    to: `${adminRoot}/users/data-list`,
    roles: [UserRole.Admin],
  },
  {
    icon: 'iconsminds-library',
    label: 'menu.exercises',
    to: `${adminRoot}/exercises/data-list`,
    roles: [UserRole.Admin, UserRole.Teacher, UserRole.Student],
  },
  {
    icon: 'iconsminds-photo',
    label: 'menu.scenes',
    to: `${adminRoot}/scenes/data-list`,
    roles: [UserRole.Admin],
  },
  {
    icon: 'iconsminds-ambulance',
    label: 'menu.victims',
    to: `${adminRoot}/victims/data-list`,
    roles: [UserRole.Admin, UserRole.Teacher],
  },
  {
    icon: 'iconsminds-camera-3',
    label: 'menu.victims-images',
    to: `${adminRoot}/victims-images/data-list`,
    roles: [UserRole.Admin, UserRole.Teacher],
  },
  {
    icon: 'iconsminds-speaker-1',
    label: 'menu.sonido',
    to: `${adminRoot}/sonido/data-list`,
    roles: [UserRole.Admin, UserRole.Teacher],
  },
];
export default data;
