const dummy = (blogs) => {
    return 1
  }
  

const totalLikes = (blogs) => {
    const arr = blogs.map(element => element.likes)
    console.log(arr)
    const reducer = (sum, item) => {
        return sum + item
      }
      return arr.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    const arr = blogs.map(element => element.likes)
    return Math.max(...arr)
}

const mostBlogs = (blogs) => {
    const arr = blogs.map(element => element.author)
    const mode = arr => {
        const mode = {};
        let max = 0, count = 0;
      
        for(let i = 0; i < arr.length; i++) {
          const item = arr[i];
          
          if(mode[item]) {
            mode[item]++;
          } else {
            mode[item] = 1;
          }
          
          if(count < mode[item]) {
            max = item;
            count = mode[item];
          }
        }
         
        return count;
      };
    return mode(arr)
}


const mostLikes = (blogs) => {
  const arr = blogs.map(element => [element.author,element.likes])
  const mode = arr => {
      const mode = {};
      let max = 0, count = 0;
    
      for(let i = 0; i < arr.length; i++) {
        const item = arr[i];
        
        if(mode[item[0]]) {
          mode[item[0]]+=item[1];
        } else {
          mode[item[0]]=item[1];
        }
        
        if(count < mode[item[0]]) {
          max = item[0];
          count = mode[item[0]];
        }
      }
      return max;
    };
  return mode(arr)
}


module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
  }

