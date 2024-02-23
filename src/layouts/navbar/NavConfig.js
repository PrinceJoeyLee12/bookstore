// routes
import { PATH } from 'routes/paths';
import SvgIconStyle from 'components/SvgIconStyle';
// ----------------------------------------------------------------------

const getIcon = (name) => <SvgIconStyle src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const ICONS = {
  user: getIcon('ic_user'),
  menuItem: getIcon('ic_menu_item'),
  book: getIcon('ic_book'),
  author: getIcon('ic_user'),
};

const navConfig = (args) => {
  const { name = '' } = args;

  // No Name means it is in guest mode (No login user)
  const otherNavs = () => {
    let navigationList = [];
    if (name) {
      navigationList.push(
        // USER
        { title: 'profile', path: PATH.user.edit(name), icon: ICONS.user },
      );
    }

    return navigationList;
  };

  return [
    {
      subheader: 'Navigations',
      items: [
        // BOOKS
        { title: 'books', path: PATH.books.list, icon: ICONS.book },
        // AUTHORS
        { title: 'authors', path: PATH.authors.list, icon: ICONS.author },
        ...otherNavs(),
      ],
    },
  ];
};

export default navConfig;
