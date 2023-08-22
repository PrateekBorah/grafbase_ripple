import { ProjectInterface } from "@/common.types";
import Categories from "@/components/Categories";
import Loadmore from "@/components/Loadmore";
import ProjectCard from "@/components/ProjectCard";
import { fetchAllProjects } from "@/lib/actions";

type ProjectSearch = {
    projectSearch: {
        edges: { node: ProjectInterface }[];
        pageInfo: {
            hasPreviousPage: boolean;
            hasNextPage: boolean;
            startCursor: string;
            endCursor: string;
        }
    }
}

type SearchParams = {
    category?:string;
    endCursor?:string;
}

type Props = {
    searchParams : SearchParams
}

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

const Home = async ({searchParams:{category, endCursor}} :Props ) => {
    const data = await fetchAllProjects(category, endCursor) as ProjectSearch;

    const projectsToDisplay = data?.projectSearch?.edges || [];

    if(projectsToDisplay.length === 0){
        return(<section className="flexStart flex-col paddings">
            <Categories/>
            <p className="no-result-text text-center">No Projects found</p>
        </section>)
    }

    const pagination = data?.projectSearch?.pageInfo

    return (
        <section className="paddings flex-start flex-col mb-16">
            <Categories/>
            <section className="projects-grid">
                {
                    projectsToDisplay.map(({node}:{node:ProjectInterface})=>(
                        <ProjectCard
                        key={node?.id}
                        id={node?.id}
                        image={node?.image}
                        title={node?.title}
                        name={node?.createdBy?.name}
                        avatarUrl={node?.createdBy?.avatarUrl}
                        userId={node?.createdBy?.id}
                        />
                    ))
                }
            </section>
            <Loadmore
            startCursor = {pagination.startCursor}
            endCursor = {pagination.endCursor}
            hasPreviousPage = {pagination.hasPreviousPage}
            hasNextPage = {pagination.hasNextPage}
            />
        </section>
    )
}

export default Home;