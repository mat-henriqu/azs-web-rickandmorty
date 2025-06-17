
import { gql } from '@apollo/client';

export const GET_EPISODES = gql`
  query GetEpisodes($page: Int, $filter: FilterEpisode) {
    episodes(page: $page, filter: $filter) {
      info {
        count
        pages
        next
        prev
      }
      results {
        id
        name
        air_date
        episode
        characters {
          id
        }
      }
    }
  }
`;

export const GET_EPISODE_DETAIL = gql`
  query GetEpisodeDetail($id: ID!) {
    episode(id: $id) {
      id
      name
      air_date
      episode
      characters {
        id
        name
        status
        species
        image
        type
        gender
        origin {
          name
        }
        location {
          name
        }
      }
    }
  }
`;

export const SEARCH_EPISODES = gql`
  query SearchEpisodes($name: String!) {
    episodes(filter: { name: $name }) {
      results {
        id
        name
        air_date
        episode
        characters {
          id
        }
      }
    }
  }
`;
