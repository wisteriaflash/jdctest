;(function(root, factory) {
    root.<%= namespace %> = factory(<%= global %>);
}(this, function(<%= param %>) {
<%= contents %>);