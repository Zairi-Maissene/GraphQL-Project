import { GraphQLError } from 'graphql';
import { createPubSub } from 'graphql-yoga';
import { PubSub } from 'graphql-yoga';
import { createSchema } from "graphql-yoga";
import { cvSkills } from './context/cvSkills';
import { skills } from './context/skills';
import { users } from './context/users';
import { cvs } from './context/cvs';
import { Subscription } from './subscription';
import * as fs from 'fs';
import * as path from 'path';

let length =4;
const pubSub = createPubSub();

export const schema = createSchema({
  typeDefs: fs.readFileSync(path.join('src', '/resolvers/schema.graphql'), 'utf-8'),
  resolvers: {
    Query: {
      hello: () => "Hello World!",
      getAllCvs: (parent,args,context)  => {
        return cvs
      },

      getCvById: (_,{id}) => {
        const cv =  cvs.find((cv) => cv?.id === id);
        const skillIds = cvSkills.filter((cvSkill) => cvSkill.cvId === id).map((cvSkill) => cvSkill.skillId);
        let addedSkills;
        length++;
        if(skillIds) {

            addedSkills = skills.filter((skill) => skillIds.includes(skill.id))
        }
        return {cv, skills: [addedSkills]}
      }
    },
    Mutation : {
      addCv:(_,{input},context)=>{
      const id = ""+(++length);
      const user = users.find((user)=> user.id==input.userId);
      if (!user) {
        return
      }
      const cv={id,name:input.name,userId:input.userId,age:input.age,job:input.job}
      cvs.push(cv)
      pubSub.publish("newCv",  cv  );

      return cv
},
    updateCv:(_,{id, input} ,context)=>{
          console.log(id)
        const cvToUpdate = cvs.filter((cv) => cv.id === id)[0];
        if (!cvToUpdate) {
          throw new GraphQLError(`Cv not found.`);
        }
        let user;
        let addedSkills;
        if (input.userId) {
          user = users.find((user) => user.id == input.userId);
          if (!user) {
            throw new GraphQLError(`User not found.`);
          }
        }
        if (input.skillIds) {
          addedSkills = skills.filter((skill) => input.skillIds.includes(skill.id));
          if (addedSkills.length !== input.skillIds.length) {
            throw new GraphQLError(`Invalid skillIds array.`);
          }
        }
        for (let skillId in input.skillIds) {
          cvSkills.push({cvId: id, skillId})


        }
        delete input.userId;
        delete input.skillIds;
        const cv ={...cvToUpdate, user, ...input}
        cvs.push(cv)
        delete cvs[cvs.indexOf(cvToUpdate)]
        length++;
        pubSub.publish("updateCv",  cvToUpdate  );
        return cv
      },
      deleteCv(_,{ id }) {

          console.log("id : ",id)
          const cvToDelete = cvs.filter((cv) => cv.id === id)[0];
          console.log(cvs.indexOf(cvToDelete,0));
        if (!cvToDelete) {
          throw new GraphQLError('Cv with the specified id is not found.')
        }

        const cvsInCvSkills = cvSkills.filter((cvSkill) => cvSkill.cvId === id)
        for (let cvSkill of cvsInCvSkills){
          delete cvSkills[cvSkills.indexOf(cvSkill)]
        }
        delete cvs[cvs.indexOf(cvToDelete)]
          pubSub.publish("delete",  cvToDelete  );

          return cvToDelete


      }
    },
  Subscription: {
      newCv: {
          subscribe: (parent, args ,context) => pubSub.subscribe("newCv"),
          resolve: (payload) => { return payload;},
      },
      updateCv: {
          subscribe: (parent, args ,context) => pubSub.subscribe("updateCv"),
          resolve: (payload) => { return payload;},
      },
      deleteCv: {
          subscribe: (parent, args ,context) => pubSub.subscribe("deleteCv"),
          resolve: (payload) => { return payload;},
      },
  }
  ,

  Cv:
  {
      user: ({userId} , args,context)=>{
       return users.find( (u)=>u.id === userId );
      }
  }

  },

});

