import { ProjectForm } from "@/common.types";
import { createProjectMutation, createUserMutation, deleteProjectMutation, getAllProjectsQuery, getProjectByIdQuery, getProjectsOfUserQuery, getUserQuery, projectsQuery, updateProjectMutation } from "@/grafql";
import { GraphQLClient } from "graphql-request";

const isProduction = process.env.NODE_ENV === 'production';
const apiUrl = isProduction?process.env.NEXT_PUBLIC_GRAFBASE_API_URL || "" : "http://127.0.0.1:4000/graphql";
const apiKey = isProduction?process.env.NEXT_PUBLIC_GRAFBASE_API_KEY || "" : "key";
const serverUrl = isProduction?process.env.NEXT_PUBLIC_SERVER_URL : "http://localhost:3000";

const client = new GraphQLClient(apiUrl);



const makeGraphQlRequest = async (query : string, variables = {})=>{
    try {
        return await client.request(query, variables)
    } catch (error) {
        console.log(error);
    }
}

export const getUser = (email:string)=>{
    client.setHeader("x-api-key",apiKey);
    return makeGraphQlRequest(getUserQuery, {email})
}

export const createUser = (name:string, email:string, avatarUrl:string)=>{
    client.setHeader("x-api-key",apiKey);
    const variables = {
        input:{
            name: name,
            email: email,
            avatarUrl: avatarUrl
        }
    };
    return makeGraphQlRequest(createUserMutation, variables);
}

export const fetchToken = async()=>{
    try {
        const response = await fetch(`${serverUrl}/api/auth/token`)
        return response.json()
    } catch (error) {
        throw error;
    }
}

const uploadImage = async (imagePath : string)=>{
    try {
        const response = await fetch(`${serverUrl}/api/upload`,{
            method:"post",
            body: JSON.stringify({path:imagePath})
        })

        return response.json()
    } catch (error) {
        throw error;
    }
}

export const createNewProject = async (form : ProjectForm, createrId : string, token: string) => {
    const imageUrl = await uploadImage(form.image);

    if(imageUrl.url){
    client.setHeader("Authorization", `Bearer ${token}`)

        const variables = {
            input : {...form,
            image:imageUrl.url,
            createdBy:{
                link : createrId
            }}
        }

        return makeGraphQlRequest(createProjectMutation, variables)
    }
}

export const fetchAllProjects = async (category?:string , endCursor?:string )=>{
    client.setHeader("x-api-key", apiKey);

    const variables = category ? {
        category, endCursor
    } : {endCursor}
    
    return category? makeGraphQlRequest(projectsQuery, variables): makeGraphQlRequest(getAllProjectsQuery, variables);
}

export const getProjectDetails = (id : string)=>{
    client.setHeader("x-api-key", apiKey);
    return makeGraphQlRequest(getProjectByIdQuery,{id});
}

export const getUserProjects = (id : string, last?: number)=>{
    client.setHeader("x-api-key", apiKey);
    return makeGraphQlRequest(getProjectsOfUserQuery,{id, last});
}

export const deleteProject = (id : string, token : string) =>{
    client.setHeader("Authorization",`Bearer ${token}`);

    return makeGraphQlRequest(deleteProjectMutation, {id});
}

export const updateProject = async (form : ProjectForm, projectId : string, token : string) =>{

    function isBase64DataURL(value : string) {
        // Regular expression to match the base64 data URL format
        const base64DataURLPattern = /^data:image\/\w+;base64,([A-Za-z0-9+/=])+$/;
        
        return base64DataURLPattern.test(value);
      }

      let updatedForm = {...form};

      const isUploadingNewImage = isBase64DataURL(form.image);

      if(isUploadingNewImage){
        const imageUrl = await uploadImage(form.image);

        if(imageUrl) {
            updatedForm = {...updatedForm, image:imageUrl.url}
        }
      }

      const variables = {
        id:projectId,
        input:updatedForm,
      }
      

    client.setHeader("Authorization",`Bearer ${token}`);

    return makeGraphQlRequest(updateProjectMutation, variables);
}