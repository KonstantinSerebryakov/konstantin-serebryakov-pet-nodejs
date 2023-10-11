import { SocialMediaNodeEntity } from './socialMediaNode.entity';

//
// SOCIAL MEDIA NODE
//

export async function extractSocialMediaNodesPublicSelf(
  socialMediaNodes: SocialMediaNodeEntity[]
) {
  return socialMediaNodes.map((node) => {
    return node.getPublicSelf();
  });
}

export async function extractSocialMediaNodesPublicNested(
  socialMediaNodes: SocialMediaNodeEntity[]
) {
  return socialMediaNodes.map((node) => {
    return node.getPublicNested();
  });
}

//
// SOCIAL MEDIA VARIANT
//

export async function extractSocialMediaVariants(
  socialMediaNodes: SocialMediaNodeEntity[]
) {
  return socialMediaNodes.map((node) => {
    return node.socialMediaVariant;
  });
}

export async function extractSocialMediaVariantsPublic(
  socialMediaNodes: SocialMediaNodeEntity[]
) {
  return socialMediaNodes.map((node) => {
    return node.socialMediaVariant.getPublic();
  });
}

export async function extractSocialMediaVariantsNames(
  socialMediaNodes: SocialMediaNodeEntity[]
) {
  return socialMediaNodes.map((node) => {
    return node.socialMediaVariant.name;
  });
}
