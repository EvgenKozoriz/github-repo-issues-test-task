import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import useStore from "../store/issuesStore";
import { capitalizeFirstLetter } from "../utils/helperFunc";

const BreadCrumbs = () => {
  const { breadCrumbs } = useStore();

  return (
    breadCrumbs[0] &&
    breadCrumbs[1] && (
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink href={`https://github.com/${breadCrumbs[0]}`}>
            {capitalizeFirstLetter(breadCrumbs[0])}
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem>
          <BreadcrumbLink
            href={`https://github.com/${breadCrumbs[0]}/${breadCrumbs[1]}`}
          >
            {capitalizeFirstLetter(breadCrumbs[1])}
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
    )
  );
};

export default BreadCrumbs;
