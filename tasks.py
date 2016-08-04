from invoke import task, run


@task
def compile(ctx):
    """
    Compile the CoffeeScript files to JavaScript.
    """
    run("coffee --compile --bare --output ./dist/ ./src/*.coffee")
