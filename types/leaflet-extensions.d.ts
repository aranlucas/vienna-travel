// eslint-disable-next-line import/no-unassigned-import -- Load the Leaflet augmentation before using or declaring its API.
import "leaflet";

declare module "leaflet" {
  namespace Icon {
    interface Default {
      _getIconUrl?: (name: string) => string | undefined;
    }
  }
}
